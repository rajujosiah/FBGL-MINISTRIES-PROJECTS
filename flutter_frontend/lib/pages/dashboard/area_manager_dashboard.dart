import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';

import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import '../../widgets/responsive_layout.dart';
import '../../widgets/profile_modal.dart';

class AreaManagerDashboard extends StatefulWidget {
  const AreaManagerDashboard({super.key});

  @override
  State<AreaManagerDashboard> createState() => _AreaManagerDashboardState();
}

class _AreaManagerDashboardState extends State<AreaManagerDashboard> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;

  List<dynamic> _projectManagers = [];
  List<dynamic> _areaProjects = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadDashboardData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _loading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final String myId = auth.userId ?? '';

    try {
      // 1. Fetch PMs reporting to me
      final pms = await _apiService.get('/profiles?role=project_manager&areaManagerId=$myId');

      // 2. Fetch projects under my Area Manager ID
      final projects = await _apiService.get('/projects?areaManagerId=$myId');

      setState(() {
        _projectManagers = pms is List ? pms : [];
        _areaProjects = projects is List ? projects : [];
        _loading = false;
      });
    } catch (e) {
      print('Error loading area manager dashboard: $e');
      setState(() => _loading = false);
    }
  }

  void _logout() {
    Provider.of<AuthProvider>(context, listen: false).logout();
    context.go('/');
  }

  void _showMyProfile() {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.currentUser == null) return;
    showDialog(
      context: context,
      builder: (context) => ProfileModal(
        user: auth.currentUser!,
        role: 'area_manager',
        onClose: () => Navigator.pop(context),
        onUpdate: () {
          Navigator.pop(context);
          _loadDashboardData();
        },
      ),
    );
  }

  void _showRegisterPMDialog() {
    final _formKey = GlobalKey<FormState>();
    final _name = TextEditingController();
    final _email = TextEditingController();
    final _password = TextEditingController();
    final _phone = TextEditingController();
    final _address = TextEditingController();

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final myProfile = auth.currentUser;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Register Project Manager'),
          content: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Assigns to Region: ${myProfile?['district'] ?? 'N/A'}, ${myProfile?['state'] ?? 'N/A'}',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Name *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _email, decoration: const InputDecoration(labelText: 'Email *'), keyboardType: TextInputType.emailAddress, validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _password, decoration: const InputDecoration(labelText: 'Password *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _phone, decoration: const InputDecoration(labelText: 'Phone Number')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _address, decoration: const InputDecoration(labelText: 'Address')),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (!_formKey.currentState!.validate()) return;
                try {
                  final body = {
                    'name': _name.text,
                    'email': _email.text,
                    'password': _password.text,
                    'role': 'project_manager',
                    'phone': _phone.text,
                    'address': _address.text,
                    // Inherit region from this Area Manager
                    'state': myProfile?['state'] ?? 'KA',
                    'district': myProfile?['district'] ?? 'BLR',
                    'area_manager_id': auth.userId,
                  };
                  await _apiService.post('/auth/register', body);
                  Navigator.pop(context);
                  _loadDashboardData();
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                }
              },
              child: const Text('Register'),
            ),
          ],
        );
      },
    );
  }

  void _showAddProjectDialog() {
    final _formKey = GlobalKey<FormState>();
    final _title = TextEditingController();
    final _description = TextEditingController();
    final _location = TextEditingController();
    final _areaOfOperation = TextEditingController();
    final _targetBeneficiaries = TextEditingController();
    String _category = 'social';
    String _status = 'upcoming';
    String? _selectedPMId;

    Uint8List? _selectedFileBytes;
    String? _fileName;
    bool _submitting = false;

    final auth = Provider.of<AuthProvider>(context, listen: false);

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Create New Project'),
              content: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                      const SizedBox(height: 12),
                      TextFormField(controller: _description, decoration: const InputDecoration(labelText: 'Description *'), maxLines: 3, validator: (v) => v!.isEmpty ? 'Required' : null),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _category,
                        items: const [
                          DropdownMenuItem(value: 'social', child: Text('Social')),
                          DropdownMenuItem(value: 'economy', child: Text('Economy')),
                          DropdownMenuItem(value: 'education', child: Text('Education')),
                        ],
                        onChanged: (val) => setDialogState(() => _category = val!),
                        decoration: const InputDecoration(labelText: 'Category'),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _status,
                        items: const [
                          DropdownMenuItem(value: 'upcoming', child: Text('Upcoming')),
                          DropdownMenuItem(value: 'ongoing', child: Text('Ongoing')),
                          DropdownMenuItem(value: 'completed', child: Text('Completed')),
                        ],
                        onChanged: (val) => setDialogState(() => _status = val!),
                        decoration: const InputDecoration(labelText: 'Status'),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(controller: _location, decoration: const InputDecoration(labelText: 'Location')),
                      const SizedBox(height: 12),
                      TextFormField(controller: _areaOfOperation, decoration: const InputDecoration(labelText: 'Area of Operation')),
                      const SizedBox(height: 12),
                      TextFormField(controller: _targetBeneficiaries, decoration: const InputDecoration(labelText: 'Target Beneficiaries')),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedPMId,
                        items: _projectManagers.map((pm) {
                          return DropdownMenuItem<String>(value: pm['_id'], child: Text(pm['name']));
                        }).toList(),
                        onChanged: (val) => setDialogState(() => _selectedPMId = val),
                        decoration: const InputDecoration(labelText: 'Assign Project Manager (Optional)'),
                      ),
                      const SizedBox(height: 16),
                      OutlinedButton.icon(
                        icon: const Icon(Icons.image),
                        label: Text(_fileName ?? 'Select Cover Image'),
                        onPressed: () async {
                          final result = await FilePicker.platform.pickFiles(type: FileType.image);
                          if (result != null && result.files.single.bytes != null) {
                            setDialogState(() {
                              _selectedFileBytes = result.files.single.bytes;
                              _fileName = result.files.single.name;
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: _submitting
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;
                          setDialogState(() => _submitting = true);
                          try {
                            final body = {
                              'title': _title.text,
                              'description': _description.text,
                              'category': _category,
                              'status': _status,
                              'location': _location.text,
                              'area_of_operation': _areaOfOperation.text,
                              'target_beneficiaries': _targetBeneficiaries.text,
                              'project_manager_id': _selectedPMId,
                              'area_manager_id': auth.userId,
                            };
                            final res = await _apiService.post('/projects', body);
                            if (res is Map && res['_id'] != null && _selectedFileBytes != null) {
                              await _apiService.uploadFile(
                                '/projects/${res['_id']}/images',
                                _selectedFileBytes!,
                                _fileName ?? 'project.jpg',
                                'image/jpeg',
                              );
                            }
                            Navigator.pop(context);
                            _loadDashboardData();
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                          } finally {
                            setDialogState(() => _submitting = false);
                          }
                        },
                  child: _submitting
                      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Create'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showEditProjectDialog(Map<String, dynamic> project) {
    final _formKey = GlobalKey<FormState>();
    final _title = TextEditingController(text: project['title'] ?? '');
    final _description = TextEditingController(text: project['description'] ?? '');
    final _location = TextEditingController(text: project['location'] ?? '');
    final _areaOfOperation = TextEditingController(text: project['area_of_operation'] ?? '');
    final _targetBeneficiaries = TextEditingController(text: project['target_beneficiaries'] ?? '');
    String _category = project['category'] ?? 'social';
    String _status = project['status'] ?? 'upcoming';
    String? _selectedPMId = project['project_manager_id'] is Map ? project['project_manager_id']['_id'] : project['project_manager_id'];

    Uint8List? _selectedFileBytes;
    String? _fileName;
    bool _saving = false;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: Text('Edit "${project['title']}"'),
              content: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                      const SizedBox(height: 12),
                      TextFormField(controller: _description, decoration: const InputDecoration(labelText: 'Description *'), maxLines: 3, validator: (v) => v!.isEmpty ? 'Required' : null),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _category,
                        items: const [
                          DropdownMenuItem(value: 'social', child: Text('Social')),
                          DropdownMenuItem(value: 'economy', child: Text('Economy')),
                          DropdownMenuItem(value: 'education', child: Text('Education')),
                        ],
                        onChanged: (val) => setDialogState(() => _category = val!),
                        decoration: const InputDecoration(labelText: 'Category'),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _status,
                        items: const [
                          DropdownMenuItem(value: 'upcoming', child: Text('Upcoming')),
                          DropdownMenuItem(value: 'ongoing', child: Text('Ongoing')),
                          DropdownMenuItem(value: 'completed', child: Text('Completed')),
                        ],
                        onChanged: (val) => setDialogState(() => _status = val!),
                        decoration: const InputDecoration(labelText: 'Status'),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(controller: _location, decoration: const InputDecoration(labelText: 'Location')),
                      const SizedBox(height: 12),
                      TextFormField(controller: _areaOfOperation, decoration: const InputDecoration(labelText: 'Area of Operation')),
                      const SizedBox(height: 12),
                      TextFormField(controller: _targetBeneficiaries, decoration: const InputDecoration(labelText: 'Target Beneficiaries')),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedPMId,
                        items: _projectManagers.map((pm) {
                          return DropdownMenuItem<String>(value: pm['_id'], child: Text(pm['name']));
                        }).toList(),
                        onChanged: (val) => setDialogState(() => _selectedPMId = val),
                        decoration: const InputDecoration(labelText: 'Assign Project Manager'),
                      ),
                      const SizedBox(height: 16),
                      OutlinedButton.icon(
                        icon: const Icon(Icons.image),
                        label: Text(_fileName ?? 'Add progress/cover image'),
                        onPressed: () async {
                          final result = await FilePicker.platform.pickFiles(type: FileType.image);
                          if (result != null && result.files.single.bytes != null) {
                            setDialogState(() {
                              _selectedFileBytes = result.files.single.bytes;
                              _fileName = result.files.single.name;
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: _saving
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;
                          setDialogState(() => _saving = true);
                          try {
                            final body = {
                              'title': _title.text,
                              'description': _description.text,
                              'category': _category,
                              'status': _status,
                              'location': _location.text,
                              'area_of_operation': _areaOfOperation.text,
                              'target_beneficiaries': _targetBeneficiaries.text,
                              'project_manager_id': _selectedPMId,
                            };
                            await _apiService.put('/projects/${project['_id']}', body);
                            if (_selectedFileBytes != null) {
                              await _apiService.uploadFile(
                                '/projects/${project['_id']}/images',
                                _selectedFileBytes!,
                                _fileName ?? 'project.jpg',
                                'image/jpeg',
                              );
                            }
                            Navigator.pop(context);
                            _loadDashboardData();
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                          } finally {
                            setDialogState(() => _saving = false);
                          }
                        },
                  child: _saving
                      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Save Changes'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Area Manager Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primaryColor,
        actions: [
          TextButton.icon(
            onPressed: _showMyProfile,
            icon: const Icon(Icons.person, color: Colors.white),
            label: const Text('My Profile', style: TextStyle(color: Colors.white)),
          ),
          const SizedBox(width: 12),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1100),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back, ${auth.name}',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Region: ${auth.currentUser?['district'] ?? 'N/A'}, ${auth.currentUser?['state'] ?? 'N/A'}',
                        style: const TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox.shrink(),
                ],
              ),
              const SizedBox(height: 24),

              TabBar(
                controller: _tabController,
                labelColor: AppTheme.secondaryColor,
                unselectedLabelColor: AppTheme.textSecondary,
                indicatorColor: AppTheme.secondaryColor,
                tabs: [
                  const Tab(text: 'Overview'),
                  Tab(text: 'Project Managers (${_projectManagers.length})'),
                  Tab(text: 'Project Management (${_areaProjects.length})'),
                ],
              ),
              const SizedBox(height: 24),

              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildOverviewTab(),
                    _buildPMsTab(),
                    _buildProjectManagementTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    final upcomingCount = _areaProjects.where((p) => p['status'] == 'upcoming').length;
    final ongoingCount = _areaProjects.where((p) => p['status'] == 'ongoing').length;
    final completedCount = _areaProjects.where((p) => p['status'] == 'completed').length;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GridView.count(
            crossAxisCount: ResponsiveLayout.isMobile(context) ? 2 : 4,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _buildStatCard('Project Managers', '${_projectManagers.length}', Icons.business_center, Colors.teal),
              _buildStatCard('Total Projects', '${_areaProjects.length}', Icons.work, Colors.blue),
              _buildStatCard('Ongoing Projects', '$ongoingCount', Icons.play_arrow, Colors.orange),
              _buildStatCard('Completed Projects', '$completedCount', Icons.check_circle, Colors.green),
            ],
          ),
          const SizedBox(height: 32),
          const Text('Regional Summary', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 12),
          Text(
            'Managing ${_projectManagers.length} active Project Managers leading ${_areaProjects.length} projects in the region of ${Provider.of<AuthProvider>(context, listen: false).currentUser?['district'] ?? 'N/A'}.',
            style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String count, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 36, color: color),
            const SizedBox(height: 12),
            Text(count, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }

  Widget _buildPMsTab() {
    if (_projectManagers.isEmpty) {
      return const Center(child: Text('No project managers registered.'));
    }

    return ListView.separated(
      itemCount: _projectManagers.length,
      separatorBuilder: (_, __) => const Divider(),
      itemBuilder: (context, index) {
        final pm = _projectManagers[index];
        return ListTile(
          leading: const CircleAvatar(child: Icon(Icons.person)),
          title: Text(pm['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('ID: ${pm['id_no'] ?? 'N/A'} • ${pm['email'] ?? ''}'),
          trailing: IconButton(
            icon: const Icon(Icons.arrow_forward, color: AppTheme.secondaryColor),
            onPressed: () => context.go('/dashboard/project-manager/${pm['_id']}'),
          ),
        );
      },
    );
  }

  Widget _buildProjectManagementTab() {
    if (_areaProjects.isEmpty) {
      return const Center(child: Text('No projects active in this area.'));
    }

    return ListView.separated(
      itemCount: _areaProjects.length,
      separatorBuilder: (_, __) => const Divider(),
      itemBuilder: (context, index) {
        final project = _areaProjects[index];
        final pmName = project['project_manager_id'] is Map ? project['project_manager_id']['name'] : 'Unassigned';

        return ListTile(
          title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Text('Category: ${project['category'].toString().toUpperCase()} • PM: $pmName'),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                project['status'].toString().toUpperCase(),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.secondaryColor),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.edit, color: AppTheme.secondaryColor),
                onPressed: () => _showEditProjectDialog(project),
              ),
            ],
          ),
        );
      },
    );
  }
}
