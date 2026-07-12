import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import '../../widgets/responsive_layout.dart';
import '../../widgets/profile_modal.dart';

class ProjectManagerDashboard extends StatefulWidget {
  const ProjectManagerDashboard({super.key});

  @override
  State<ProjectManagerDashboard> createState() => _ProjectManagerDashboardState();
}

class _ProjectManagerDashboardState extends State<ProjectManagerDashboard> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;
  
  List<dynamic> _socialWorkers = [];
  List<dynamic> _myProjects = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
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
      // 1. Fetch Social Workers reporting to me
      final sws = await _apiService.get('/profiles?role=social_worker&projectManagerId=$myId');
      
      // 2. Fetch projects assigned to me
      final projects = await _apiService.get('/projects?projectManagerId=$myId');

      setState(() {
        _socialWorkers = sws is List ? sws : [];
        _myProjects = projects is List ? projects : [];
        _loading = false;
      });
    } catch (e) {
      print('Error loading PM dashboard: $e');
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
        role: 'project_manager',
        onClose: () => Navigator.pop(context),
        onUpdate: () {
          Navigator.pop(context);
          _loadDashboardData();
        },
      ),
    );
  }

  void _showRegisterSWDialog() {
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
          title: const Text('Register Social Worker'),
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
                    'role': 'social_worker',
                    'phone': _phone.text,
                    'address': _address.text,
                    'state': myProfile?['state'] ?? 'KA',
                    'district': myProfile?['district'] ?? 'BLR',
                    'project_manager_id': auth.userId,
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

  void _showAssignProjectDialog(Map<String, dynamic> project) {
    String? _selectedSWId = project['social_worker_id']?['_id'] ?? project['social_worker_id'];

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Assign Social Worker'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Select a Social Worker in your team to run this project:'),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _selectedSWId,
                    items: _socialWorkers.map((sw) {
                      return DropdownMenuItem<String>(value: sw['_id'], child: Text(sw['name']));
                    }).toList(),
                    onChanged: (val) => setDialogState(() => _selectedSWId = val),
                    decoration: const InputDecoration(labelText: 'Social Worker'),
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: () async {
                    if (_selectedSWId == null) return;
                    try {
                      await _apiService.put('/projects/${project['_id']}', {
                        'social_worker_id': _selectedSWId,
                      });
                      Navigator.pop(context);
                      _loadDashboardData();
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                    }
                  },
                  child: const Text('Assign'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _handleUnassignProject(Map<String, dynamic> project) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Unassign'),
        content: Text('Are you sure you want to unassign "${project['title']}" from the Social Worker?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Unassign', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _apiService.put('/projects/${project['_id']}', {
          'social_worker_id': null,
        });
        _loadDashboardData();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Unassignment failed: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final bool isMobile = ResponsiveLayout.isMobile(context);

    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final availableProjects = _myProjects.where((p) => p['social_worker_id'] == null).toList();
    final assignedProjects = _myProjects.where((p) => p['social_worker_id'] != null).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Project Manager Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
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
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
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
                        'District: ${auth.currentUser?['district'] ?? 'N/A'}, ${auth.currentUser?['state'] ?? 'N/A'} • ${auth.currentUser?['id_no'] ?? 'N/A'}',
                        style: const TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox.shrink(),
                ],
              ),
              const SizedBox(height: 24),

              // Tab headers
              Container(
                color: Colors.white,
                child: TabBar(
                  controller: _tabController,
                  labelColor: AppTheme.secondaryColor,
                  unselectedLabelColor: AppTheme.textSecondary,
                  indicatorColor: AppTheme.secondaryColor,
                  onTap: (index) => setState(() {}),
                  tabs: [
                    const Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
                    Tab(icon: const Icon(Icons.work), text: 'Available Projects (${availableProjects.length})'),
                    Tab(icon: const Icon(Icons.assignment_turned_in), text: 'Assigned Projects (${assignedProjects.length})'),
                    Tab(icon: const Icon(Icons.diversity_3), text: 'Social Workers (${_socialWorkers.length})'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Tab views
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  physics: const NeverScrollableScrollPhysics(), // Disable swipe to force tab clicks
                  children: [
                    _buildOverviewTab(availableProjects.length, assignedProjects.length),
                    _buildAvailableProjectsTab(availableProjects),
                    _buildAssignedProjectsTab(assignedProjects),
                    _buildSocialWorkersTab(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ===========================================================================
  // 1. OVERVIEW TAB
  // ===========================================================================
  Widget _buildOverviewTab(int availableCount, int assignedCount) {
    final activeCount = _myProjects.where((p) => p['status'] == 'ongoing').length;
    final completedCount = _myProjects.where((p) => p['status'] == 'completed').length;
    final upcomingCount = _myProjects.where((p) => p['status'] == 'upcoming').length;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Dashboard Overview', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 20),
          
          // Stats Grid
          GridView.count(
            crossAxisCount: ResponsiveLayout.isMobile(context) ? 2 : 4,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _buildStatCard('Total Projects', '${_myProjects.length}', Icons.work, Colors.blue),
              _buildStatCard('Unassigned', '$availableCount', Icons.assignment_late, Colors.orange),
              _buildStatCard('Assigned Projects', '$assignedCount', Icons.assignment_turned_in, Colors.green),
              _buildStatCard('Social Workers', '${_socialWorkers.length}', Icons.diversity_3, Colors.purple),
            ],
          ),
          const SizedBox(height: 32),
          
          // Secondary Project Status Stats
          const Text('Project Status Summary', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatusOverviewItem('Upcoming', '$upcomingCount', Colors.orange),
                  _buildStatusOverviewItem('Ongoing', '$activeCount', Colors.blue),
                  _buildStatusOverviewItem('Completed', '$completedCount', Colors.green),
                ],
              ),
            ),
          )
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

  Widget _buildStatusOverviewItem(String label, String count, Color color) {
    return Column(
      children: [
        Text(count, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
      ],
    );
  }

  // ===========================================================================
  // 2. AVAILABLE PROJECTS TAB
  // ===========================================================================
  Widget _buildAvailableProjectsTab(List<dynamic> available) {
    if (available.isEmpty) {
      return const Center(child: Text('No unassigned projects available.'));
    }

    return ListView.builder(
      itemCount: available.length,
      itemBuilder: (context, index) {
        final project = available[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Category: ${project['category'].toString().toUpperCase()} • Status: ${project['status']}'),
            trailing: ElevatedButton.icon(
              icon: const Icon(Icons.person_add_alt, size: 14),
              label: const Text('Assign SW'),
              onPressed: () => _showAssignProjectDialog(project),
            ),
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 3. ASSIGNED PROJECTS TAB
  // ===========================================================================
  Widget _buildAssignedProjectsTab(List<dynamic> assigned) {
    if (assigned.isEmpty) {
      return const Center(child: Text('No assigned projects found.'));
    }

    return ListView.builder(
      itemCount: assigned.length,
      itemBuilder: (context, index) {
        final project = assigned[index];
        final swName = project['social_worker_id'] != null 
            ? (project['social_worker_id'] is Map ? project['social_worker_id']['name'] : 'Assigned SW') 
            : 'Assigned';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Assigned To: $swName • Status: ${project['status']}'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                OutlinedButton.icon(
                  icon: const Icon(Icons.person_add_alt, size: 14),
                  label: const Text('Reassign'),
                  onPressed: () => _showAssignProjectDialog(project),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.link_off, color: AppTheme.errorColor),
                  tooltip: 'Unassign Social Worker',
                  onPressed: () => _handleUnassignProject(project),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ===========================================================================
  // 4. SOCIAL WORKERS TAB
  // ===========================================================================
  Widget _buildSocialWorkersTab() {
    if (_socialWorkers.isEmpty) {
      return const Center(child: Text('No social workers registered. Click "Register Social Worker" above to add.'));
    }

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 340,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 1.8,
      ),
      itemCount: _socialWorkers.length,
      itemBuilder: (context, index) {
        final sw = _socialWorkers[index];
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 24,
                  backgroundColor: AppTheme.secondaryColor,
                  child: Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(sw['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      const SizedBox(height: 4),
                      Text('ID: ${sw['id_no'] ?? 'N/A'}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                      if (sw['phone'] != null && sw['phone'].toString().isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text('Phone: ${sw['phone']}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
