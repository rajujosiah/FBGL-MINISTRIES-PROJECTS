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

class SocialWorkerDashboard extends StatefulWidget {
  const SocialWorkerDashboard({super.key});

  @override
  State<SocialWorkerDashboard> createState() => _SocialWorkerDashboardState();
}

class _SocialWorkerDashboardState extends State<SocialWorkerDashboard> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;
  List<dynamic> _myProjects = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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
      // Fetch projects assigned to me
      final projects = await _apiService.get('/projects?socialWorkerId=$myId');
      setState(() {
        _myProjects = projects is List ? projects : [];
        _loading = false;
      });
    } catch (e) {
      print('Error loading Social Worker projects: $e');
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
        role: 'social_worker',
        onClose: () => Navigator.pop(context),
        onUpdate: () {
          Navigator.pop(context);
          _loadDashboardData();
        },
      ),
    );
  }

  void _showUpdateProjectDialog(Map<String, dynamic> project) {
    final _formKey = GlobalKey<FormState>();
    final _description = TextEditingController(text: project['description']);
    String _status = project['status'] ?? 'upcoming';

    Uint8List? _selectedFileBytes;
    String? _fileName;
    bool _uploading = false;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: Text('Update Project: ${project['title']}'),
              content: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
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
                      TextFormField(
                        controller: _description,
                        decoration: const InputDecoration(labelText: 'Update Description'),
                        maxLines: 4,
                        validator: (v) => v!.isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 20),
                      
                      // Progress image picker
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Upload Progress Image (Optional)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.primaryColor),
                        ),
                      ),
                      const SizedBox(height: 8),
                      OutlinedButton.icon(
                        icon: const Icon(Icons.photo_library),
                        label: Text(_fileName ?? 'Choose progress photo'),
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
                  onPressed: _uploading
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;
                          
                          setDialogState(() => _uploading = true);

                          try {
                            // 1. Update project status and description
                            await _apiService.put('/projects/${project['_id']}', {
                              'status': _status,
                              'description': _description.text,
                            });

                            // 2. Upload image if selected
                            if (_selectedFileBytes != null) {
                              await _apiService.uploadFile(
                                '/projects/${project['_id']}/images',
                                _selectedFileBytes!,
                                _fileName ?? 'progress.jpg',
                                'image/jpeg',
                              );
                            }

                            Navigator.pop(context);
                            _loadDashboardData();
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Update failed: $e')));
                          } finally {
                            setDialogState(() => _uploading = false);
                          }
                        },
                  child: _uploading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Submit Update'),
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
        title: const Text('Social Worker Portal', style: TextStyle(fontWeight: FontWeight.bold)),
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
          constraints: const BoxConstraints(maxWidth: 900),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Header
              Text(
                'Welcome, ${auth.name}',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
              ),
              const SizedBox(height: 4),
              Text(
                'Staff ID: ${auth.currentUser?['id_no'] ?? 'N/A'} • Region: ${auth.currentUser?['district'] ?? 'N/A'}, ${auth.currentUser?['state'] ?? 'N/A'}',
                style: const TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 24),

              TabBar(
                controller: _tabController,
                labelColor: AppTheme.secondaryColor,
                unselectedLabelColor: AppTheme.textSecondary,
                indicatorColor: AppTheme.secondaryColor,
                tabs: [
                  const Tab(text: 'Overview'),
                  Tab(text: 'Assigned Projects (${_myProjects.length})'),
                ],
              ),
              const SizedBox(height: 24),

              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildOverviewTab(),
                    _buildProjectsTab(),
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
    final ongoingCount = _myProjects.where((p) => p['status'] == 'ongoing' || p['status'] == 'Ongoing').length;
    final completedCount = _myProjects.where((p) => p['status'] == 'completed' || p['status'] == 'Completed').length;
    final upcomingCount = _myProjects.where((p) => p['status'] == 'upcoming' || p['status'] == 'Upcoming').length;

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
              _buildStatCard('Total Projects', '${_myProjects.length}', Icons.work, Colors.blue),
              _buildStatCard('Ongoing', '$ongoingCount', Icons.play_arrow, Colors.orange),
              _buildStatCard('Completed', '$completedCount', Icons.check_circle, Colors.green),
              _buildStatCard('Upcoming', '$upcomingCount', Icons.schedule, Colors.grey),
            ],
          ),
          const SizedBox(height: 32),
          const Text('My Task Summary', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 12),
          Text(
            'You are assigned to ${_myProjects.length} projects in total. Please update project status and upload field photos regularly to keep the coordinators updated.',
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

  Widget _buildProjectsTab() {
    if (_myProjects.isEmpty) {
      return const Card(
        child: Center(
          child: Padding(
            padding: EdgeInsets.all(32),
            child: Text('No projects currently assigned to you.'),
          ),
        ),
      );
    }

    return ListView.builder(
      itemCount: _myProjects.length,
      itemBuilder: (context, index) {
        final project = _myProjects[index];
        final String banner = (project['images'] is List && (project['images'] as List).isNotEmpty)
            ? (project['images'] as List)[0]
            : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024';

        final imagesList = project['images'] is List ? project['images'] as List : [];

        return Card(
          margin: const EdgeInsets.only(bottom: 20),
          clipBehavior: Clip.antiAlias,
          child: ExpansionTile(
            leading: Image.network(banner, width: 60, height: 60, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.work)),
            title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Category: ${project['category'].toString().toUpperCase()} • Status: ${project['status'].toString().toUpperCase()}'),
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Description:', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(project['description'] ?? ''),
                    const SizedBox(height: 16),

                    if (imagesList.isNotEmpty) ...[
                      const Text('Progress Images:', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      SizedBox(
                        height: 100,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: imagesList.length,
                          itemBuilder: (context, idx) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(imagesList[idx], width: 100, height: 100, fit: BoxFit.cover),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _showUpdateProjectDialog(project),
                          icon: const Icon(Icons.edit_note),
                          label: const Text('Update Progress / Upload Photo'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.secondaryColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
