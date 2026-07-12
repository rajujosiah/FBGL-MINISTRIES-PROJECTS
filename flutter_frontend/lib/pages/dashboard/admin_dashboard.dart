import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';

import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import '../../widgets/responsive_layout.dart';
import '../../widgets/manage_assignments_widget.dart';
import '../../widgets/reports_widget.dart';
import '../../widgets/profile_modal.dart';
import '../../utils/state_districts_data.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  final ApiService _apiService = ApiService();
  int _activeTab = 0;

  List<dynamic> _profiles = [];
  List<dynamic> _projects = [];
  List<dynamic> _blogs = [];
  List<dynamic> _stateDistricts = [];
  Map<String, dynamic> _settings = {};

  bool _loading = true;
  String? _filteredMemberId;
  String? _filteredMemberName;

  // Sidebar tabs matching old React: Overview, Admins, AMs, PMs, SWs, Projects, Assignments, Board Members, Blog, Reports
  static const List<_SidebarItem> _sidebarItems = [
    _SidebarItem('Overview', Icons.dashboard),
    _SidebarItem('Admins', Icons.admin_panel_settings),
    _SidebarItem('Area Managers', Icons.location_on),
    _SidebarItem('Project Managers', Icons.business_center),
    _SidebarItem('Social Workers', Icons.diversity_3),
    _SidebarItem('Projects', Icons.work),
    _SidebarItem('Assignments', Icons.assignment_ind),
    _SidebarItem('Board Members', Icons.groups),
    _SidebarItem('Blog Posts', Icons.newspaper),
    _SidebarItem('Reports', Icons.analytics),
    _SidebarItem('Settings', Icons.settings),
  ];

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _loading = true);
    try {
      final pr = await _apiService.get('/profiles');
      final pj = await _apiService.get('/projects');
      final bl = await _apiService.get('/blog');
      final sd = await _apiService.get('/state-districts');
      final se = await _apiService.get('/settings');

      setState(() {
        _profiles = pr is List ? pr : [];
        _projects = pj is List ? pj : [];
        _blogs = bl is List ? bl : [];
        _stateDistricts = sd is List ? sd : [];
        _settings = se is Map<String, dynamic> ? se : {};
        _loading = false;
      });
    } catch (e) {
      print('Error loading dashboard data: $e');
      setState(() => _loading = false);
    }
  }

  void _logout() {
    Provider.of<AuthProvider>(context, listen: false).logout();
    context.go('/');
  }

  // Helper: filter profiles by role
  List<dynamic> _byRole(String role) => _profiles.where((p) => p['role'] == role).toList();

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final bool isMobile = ResponsiveLayout.isMobile(context);

    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primaryColor,
        actions: [
          Text(auth.name ?? 'Admin', style: const TextStyle(color: Colors.white, fontSize: 14)),
          IconButton(icon: const Icon(Icons.logout, color: Colors.white), onPressed: _logout, tooltip: 'Logout'),
          const SizedBox(width: 16),
        ],
      ),
      body: isMobile
          ? Column(children: [_buildMobileTabBar(), Expanded(child: _buildMainContent())])
          : Row(crossAxisAlignment: CrossAxisAlignment.start, children: [_buildSidebar(), const VerticalDivider(width: 1), Expanded(child: _buildMainContent())]),
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 220,
      color: AppTheme.primaryColor,
      child: Column(
        children: [
          const SizedBox(height: 24),
          const CircleAvatar(radius: 32, backgroundColor: AppTheme.secondaryColor, child: Icon(Icons.security, color: Colors.white, size: 32)),
          const SizedBox(height: 12),
          const Text('Super Admin Portal', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 24),
          Expanded(
            child: ListView.builder(
              itemCount: _sidebarItems.length,
              itemBuilder: (context, index) {
                final item = _sidebarItems[index];
                final isSelected = _activeTab == index;
                return ListTile(
                  dense: true,
                  leading: Icon(item.icon, color: isSelected ? AppTheme.secondaryColor : Colors.white70, size: 20),
                  title: Text(item.label, style: TextStyle(color: isSelected ? AppTheme.secondaryColor : Colors.white70, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, fontSize: 13)),
                  onTap: () => setState(() => _activeTab = index),
                  selected: isSelected,
                  selectedTileColor: Colors.white.withOpacity(0.05),
                );
              },
            ),
          ),
          ListTile(
            leading: const Icon(Icons.arrow_back, color: Colors.white70),
            title: const Text('Visit Homepage', style: TextStyle(color: Colors.white70, fontSize: 13)),
            onTap: () => context.go('/'),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildMobileTabBar() {
    return Container(
      color: AppTheme.primaryColor,
      height: 48,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _sidebarItems.length,
        itemBuilder: (context, index) {
          final item = _sidebarItems[index];
          final isSelected = _activeTab == index;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: IconButton(
              icon: Icon(item.icon, color: isSelected ? AppTheme.secondaryColor : Colors.white70, size: 20),
              tooltip: item.label,
              onPressed: () => setState(() => _activeTab = index),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMainContent() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_activeTab == 0) _buildOverviewSection(),
            if (_activeTab == 1) _buildRoleSection('admin', 'Admins'),
            if (_activeTab == 2) _buildRoleSection('area_manager', 'Area Managers'),
            if (_activeTab == 3) _buildRoleSection('project_manager', 'Project Managers'),
            if (_activeTab == 4) _buildRoleSection('social_worker', 'Social Workers'),
            if (_activeTab == 5) _buildProjectsSection(),
            if (_activeTab == 6) ManageAssignmentsWidget(allProfiles: _profiles, onUpdate: _loadDashboardData),
            if (_activeTab == 7) _buildRoleSection('board_member', 'Board Members'),
            if (_activeTab == 8) _buildBlogSection(),
            if (_activeTab == 9) ReportsWidget(allProfiles: _profiles, allProjects: _projects),
            if (_activeTab == 10) _buildSettingsSection(),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // 0. OVERVIEW
  // ===========================================================================
  Widget _buildOverviewSection() {
    final admins = _byRole('admin').length;
    final ams = _byRole('area_manager').length;
    final pms = _byRole('project_manager').length;
    final sws = _byRole('social_worker').length;
    final boards = _byRole('board_member').length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Dashboard Overview', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
        const SizedBox(height: 24),
        GridView.count(
          crossAxisCount: ResponsiveLayout.isMobile(context) ? 2 : 4,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _buildStatCard('Admins', '$admins', Icons.admin_panel_settings, Colors.deepPurple),
            _buildStatCard('Area Managers', '$ams', Icons.location_on, Colors.blue),
            _buildStatCard('Project Managers', '$pms', Icons.business_center, Colors.teal),
            _buildStatCard('Social Workers', '$sws', Icons.diversity_3, Colors.orange),
            _buildStatCard('Projects', '${_projects.length}', Icons.work, Colors.green),
            _buildStatCard('Blog Posts', '${_blogs.length}', Icons.newspaper, Colors.pink),
            _buildStatCard('Board Members', '$boards', Icons.groups, Colors.indigo),
            _buildStatCard('Regions', '${_stateDistricts.length}', Icons.map, Colors.brown),
          ],
        ),
      ],
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

  // ===========================================================================
  int _getMemberProjectsCount(Map<String, dynamic> member) {
    final String id = member['_id']?.toString() ?? '';
    final String role = member['role'] ?? '';
    if (id.isEmpty) return 0;
    
    if (role == 'social_worker') {
      return _projects.where((p) {
        final sw = p['social_worker_id'];
        if (sw == null) return false;
        if (sw is Map) return sw['_id']?.toString() == id;
        return sw.toString() == id;
      }).length;
    } else if (role == 'project_manager') {
      return _projects.where((p) {
        final pm = p['project_manager_id'];
        if (pm == null) return false;
        if (pm is Map) return pm['_id']?.toString() == id;
        return pm.toString() == id;
      }).length;
    } else if (role == 'area_manager') {
      final pmIds = _profiles
          .where((p) => p['role'] == 'project_manager' && (p['area_manager_id']?.toString() == id || (p['area_manager_id'] is Map && p['area_manager_id']['_id']?.toString() == id)))
          .map((p) => p['_id']?.toString())
          .toSet();
      return _projects.where((p) {
        final pm = p['project_manager_id'];
        if (pm == null) return false;
        final pmIdStr = pm is Map ? pm['_id']?.toString() : pm.toString();
        return pmIds.contains(pmIdStr);
      }).length;
    }
    return 0;
  }

  // ROLE SECTION (Admins, AMs, PMs, SWs, Board Members)
  // ===========================================================================
  Widget _buildRoleSection(String role, String title) {
    final members = _byRole(role);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Manage $title', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            ElevatedButton.icon(
              onPressed: () => _showAddMemberDialog(role),
              icon: const Icon(Icons.person_add),
              label: Text('Add $title'),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: members.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final member = members[index];
              final ppic = member['profile_picture'];
              final projCount = _getMemberProjectsCount(member);
              final isStaff = role == 'area_manager' || role == 'project_manager' || role == 'social_worker';

              return ListTile(
                leading: CircleAvatar(
                  backgroundImage: (ppic != null && ppic.toString().isNotEmpty) ? NetworkImage(ppic) : null,
                  child: ppic == null || ppic.toString().isEmpty ? const Icon(Icons.person) : null,
                ),
                title: Text(member['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('${member['id_no'] ?? (role == 'board_member' ? member['position'] ?? '' : 'N/A')} • ${member['state'] ?? ''}-${member['district'] ?? ''}${isStaff ? " • $projCount Project(s)" : ""}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (isStaff && projCount > 0)
                      IconButton(
                        icon: const Icon(Icons.folder_special, color: Colors.blueAccent),
                        tooltip: 'View Projects',
                        onPressed: () {
                          setState(() {
                            _filteredMemberId = member['_id'];
                            _filteredMemberName = member['name'];
                            _activeTab = 5; // Switch to Projects tab
                          });
                        },
                      ),
                    IconButton(
                      icon: const Icon(Icons.edit, color: AppTheme.secondaryColor),
                      tooltip: 'Edit',
                      onPressed: () => _showEditMemberDialog(member),
                    ),
                    IconButton(
                      icon: const Icon(Icons.badge, color: Colors.teal),
                      tooltip: 'View Profile / ID Card',
                      onPressed: () => _showProfileModal(member),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: AppTheme.errorColor),
                      tooltip: 'Delete',
                      onPressed: () => _deleteProfile(member['_id']),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showProfileModal(Map<String, dynamic> member) {
    showDialog(
      context: context,
      builder: (context) => ProfileModal(
        user: member,
        role: member['role'] ?? 'admin',
        onClose: () => Navigator.pop(context),
        onUpdate: () {
          Navigator.pop(context);
          _loadDashboardData();
        },
      ),
    );
  }

  Future<void> _deleteProfile(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text('Are you sure you want to delete this member? This deletes their account permanently.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );
    if (confirm == true) {
      try {
        await _apiService.delete('/profiles/$id');
        _loadDashboardData();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Delete failed: $e')));
      }
    }
  }

  void _showAddMemberDialog([String? defaultRole]) {
    final _formKey = GlobalKey<FormState>();
    final _name = TextEditingController();
    final _email = TextEditingController();
    final _password = TextEditingController();
    final _position = TextEditingController();
    final _phone = TextEditingController();
    String _state = '';
    String _district = '';
    String _role = defaultRole ?? 'social_worker';
    String? _selectedManagerId;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          final managers = _profiles.where((p) {
            if (_role == 'project_manager') return p['role'] == 'area_manager';
            if (_role == 'social_worker') return p['role'] == 'project_manager';
            return false;
          }).toList();

          final availableDistricts = _state.isNotEmpty ? getDistrictsForState(_state) : <String>[];

          return AlertDialog(
            title: const Text('Register Staff Member'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      value: _role,
                      items: const [
                        DropdownMenuItem(value: 'admin', child: Text('Admin')),
                        DropdownMenuItem(value: 'board_member', child: Text('Board Member')),
                        DropdownMenuItem(value: 'area_manager', child: Text('Area Manager')),
                        DropdownMenuItem(value: 'project_manager', child: Text('Project Manager')),
                        DropdownMenuItem(value: 'social_worker', child: Text('Social Worker')),
                      ],
                      onChanged: (val) {
                        if (val != null) setDialogState(() { _role = val; _selectedManagerId = null; });
                      },
                      decoration: const InputDecoration(labelText: 'Role'),
                    ),
                    const SizedBox(height: 12),
                    TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Name *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                    if (_role != 'board_member') ...[
                      const SizedBox(height: 12),
                      TextFormField(controller: _email, decoration: const InputDecoration(labelText: 'Email *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                      const SizedBox(height: 12),
                      TextFormField(controller: _password, decoration: const InputDecoration(labelText: 'Password *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                    ],
                    const SizedBox(height: 12),
                    if (_role == 'board_member') ...[
                      const SizedBox(height: 12),
                      TextFormField(controller: _position, decoration: const InputDecoration(labelText: 'Board Position (e.g., President)')),
                    ],
                    const SizedBox(height: 12),
                    TextFormField(controller: _phone, decoration: const InputDecoration(labelText: 'Phone')),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _state.isEmpty ? null : _state,
                      items: stateEntries.map((e) => DropdownMenuItem(value: e.key, child: Text('${e.key} - ${e.value}'))).toList(),
                      onChanged: (val) => setDialogState(() { _state = val ?? ''; _district = ''; }),
                      decoration: const InputDecoration(labelText: 'State'),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _district.isEmpty ? null : _district,
                      items: availableDistricts.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                      onChanged: (val) => setDialogState(() => _district = val ?? ''),
                      decoration: const InputDecoration(labelText: 'District'),
                    ),
                    if (managers.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedManagerId,
                        items: managers.map((m) => DropdownMenuItem<String>(value: m['_id'].toString(), child: Text('${m['name']} (${m['id_no']})'))).toList(),
                        onChanged: (val) => setDialogState(() => _selectedManagerId = val),
                        decoration: InputDecoration(labelText: _role == 'project_manager' ? 'Assign Area Manager' : 'Assign Project Manager'),
                      ),
                    ],
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
                      'email': _role == 'board_member' ? null : _email.text,
                      'password': _role == 'board_member' ? null : _password.text,
                      'role': _role,
                      'position': _position.text,
                      'phone': _phone.text,
                      'state': _state,
                      'district': _district,
                    };
                    if (_role == 'project_manager') body['area_manager_id'] = _selectedManagerId;
                    if (_role == 'social_worker') body['project_manager_id'] = _selectedManagerId;

                    await _apiService.post('/auth/register', body);
                    Navigator.pop(context);
                    _loadDashboardData();
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Registration failed: $e')));
                  }
                },
                child: const Text('Register'),
              ),
            ],
          );
        });
      },
    );
  }

  void _showEditMemberDialog(Map<String, dynamic> member) {
    final _formKey = GlobalKey<FormState>();
    final _name = TextEditingController(text: member['name'] ?? '');
    final _phone = TextEditingController(text: member['phone'] ?? '');
    final _address = TextEditingController(text: member['address'] ?? '');
    final _bio = TextEditingController(text: member['bio'] ?? '');
    final _aadhaar = TextEditingController(text: member['aadhaar_no'] ?? '');
    final _position = TextEditingController(text: member['position'] ?? '');
    String _state = member['state'] ?? '';
    String _district = member['district'] ?? '';

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          final availableDistricts = _state.isNotEmpty ? getDistrictsForState(_state) : <String>[];

          return AlertDialog(
            title: Text('Edit ${member['name']}'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Name'), validator: (v) => v!.isEmpty ? 'Required' : null),
                    const SizedBox(height: 12),
                    TextFormField(controller: _phone, decoration: const InputDecoration(labelText: 'Phone')),
                    const SizedBox(height: 12),
                    TextFormField(controller: _address, decoration: const InputDecoration(labelText: 'Address'), maxLines: 2),
                    const SizedBox(height: 12),
                    TextFormField(controller: _aadhaar, decoration: const InputDecoration(labelText: 'Aadhaar Number')),
                    const SizedBox(height: 12),
                    TextFormField(controller: _bio, decoration: const InputDecoration(labelText: 'Bio'), maxLines: 2),
                    if (member['role'] == 'board_member') ...[
                      const SizedBox(height: 12),
                      TextFormField(controller: _position, decoration: const InputDecoration(labelText: 'Board Position')),
                    ],
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _state.isEmpty ? null : _state,
                      items: stateEntries.map((e) => DropdownMenuItem(value: e.key, child: Text('${e.key} - ${e.value}'))).toList(),
                      onChanged: (val) => setDialogState(() { _state = val ?? ''; _district = ''; }),
                      decoration: const InputDecoration(labelText: 'State'),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: availableDistricts.contains(_district) ? _district : null,
                      items: availableDistricts.map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                      onChanged: (val) => setDialogState(() => _district = val ?? ''),
                      decoration: const InputDecoration(labelText: 'District'),
                    ),
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
                      'phone': _phone.text,
                      'address': _address.text,
                      'bio': _bio.text,
                      'aadhaar_no': _aadhaar.text,
                      'state': _state,
                      'district': _district,
                    };
                    if (member['role'] == 'board_member') body['position'] = _position.text;

                    await _apiService.put('/profiles/${member['_id']}', body);
                    Navigator.pop(context);
                    _loadDashboardData();
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Update failed: $e')));
                  }
                },
                child: const Text('Save Changes'),
              ),
            ],
          );
        });
      },
    );
  }

  // ===========================================================================
  // PROJECTS
  // ===========================================================================
  Widget _buildProjectsSection() {
    final filteredProjects = _filteredMemberId == null
        ? _projects
        : _projects.where((p) {
            final pmId = p['project_manager_id'] is Map ? p['project_manager_id']['_id']?.toString() : p['project_manager_id']?.toString();
            final swId = p['social_worker_id'] is Map ? p['social_worker_id']['_id']?.toString() : p['social_worker_id']?.toString();
            
            if (pmId == _filteredMemberId || swId == _filteredMemberId) return true;
            
            final isPMUnderAM = _profiles.any((pr) =>
                pr['role'] == 'project_manager' &&
                pr['_id']?.toString() == pmId &&
                (pr['area_manager_id']?.toString() == _filteredMemberId ||
                    (pr['area_manager_id'] is Map && pr['area_manager_id']['_id']?.toString() == _filteredMemberId)));
            return isPMUnderAM;
          }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Manage Projects', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            ElevatedButton.icon(
              onPressed: () => _showAddProjectDialog(),
              icon: const Icon(Icons.add_business),
              label: const Text('Create Project'),
            ),
          ],
        ),
        const SizedBox(height: 24),

        if (_filteredMemberId != null) ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.secondaryColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.secondaryColor),
            ),
            child: Row(
              children: [
                const Icon(Icons.filter_list, color: AppTheme.secondaryColor),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Showing projects assigned to $_filteredMemberName (${filteredProjects.length} found)',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _filteredMemberId = null;
                      _filteredMemberName = null;
                    });
                  },
                  child: const Text('Clear Filter', style: TextStyle(color: AppTheme.errorColor, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        Card(
          child: filteredProjects.isEmpty
              ? const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: Text('No projects found matching the criteria.'),
                  ),
                )
              : ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: filteredProjects.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final project = filteredProjects[index];
                    final bool showOnHome = project['show_on_home'] == true;
                    final pmName = project['project_manager_id'] is Map ? project['project_manager_id']['name'] : 'Unassigned';
                    final swName = project['social_worker_id'] is Map ? project['social_worker_id']['name'] : 'Unassigned';

                    return ListTile(
                      title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${project['category'].toString().toUpperCase()} • ${project['status']} • ${project['location'] ?? '-'} • PM: $pmName • SW: $swName'),
                      trailing: Wrap(
                        spacing: 8,
                        children: [
                          TextButton.icon(
                            icon: Icon(showOnHome ? Icons.check_circle : Icons.radio_button_unchecked, color: showOnHome ? AppTheme.successColor : AppTheme.textSecondary),
                            label: Text(showOnHome ? 'On Home' : 'Show on Home', style: TextStyle(color: showOnHome ? AppTheme.successColor : AppTheme.textSecondary, fontSize: 11)),
                            onPressed: () => _toggleProjectHome(project['_id'], !showOnHome),
                          ),
                          IconButton(icon: const Icon(Icons.edit, color: AppTheme.secondaryColor), tooltip: 'Edit', onPressed: () => _showEditProjectDialog(project)),
                          IconButton(icon: const Icon(Icons.delete, color: AppTheme.errorColor), tooltip: 'Delete', onPressed: () => _deleteProject(project['_id'])),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Future<void> _toggleProjectHome(String id, bool val) async {
    try {
      await _apiService.put('/projects/$id/toggle-home', {'show_on_home': val});
      _loadDashboardData();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
    }
  }

  Future<void> _deleteProject(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text('Are you sure you want to delete this project?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );
    if (confirm == true) {
      try {
        await _apiService.delete('/projects/$id');
        _loadDashboardData();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
      }
    }
  }

  void _showAddProjectDialog() {
    final _formKey = GlobalKey<FormState>();
    final _title = TextEditingController();
    final _description = TextEditingController();
    final _location = TextEditingController();
    final _areaOfOperation = TextEditingController();
    final _targetBeneficiaries = TextEditingController();
    String _category = 'social';
    bool _isCustomCategory = false;
    final _customCategoryController = TextEditingController();

    String _status = 'upcoming';
    String? _selectedPMId;
    String? _selectedSWId;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          final pms = _profiles.where((p) => p['role'] == 'project_manager').toList();
          final sws = _profiles.where((p) => p['role'] == 'social_worker').toList();

          final existingCategories = _projects
              .map((p) => p['category']?.toString().toLowerCase().trim() ?? '')
              .where((c) => c.isNotEmpty)
              .toSet()
              .toList();
          for (var c in ['social', 'economy', 'education']) {
            if (!existingCategories.contains(c)) existingCategories.add(c);
          }

          return AlertDialog(
            title: const Text('Create New Project'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _description, decoration: const InputDecoration(labelText: 'Description *'), maxLines: 3, validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  if (!_isCustomCategory)
                    DropdownButtonFormField<String>(
                      value: existingCategories.contains(_category) ? _category : existingCategories.first,
                      items: [
                        ...existingCategories.map((c) => DropdownMenuItem(value: c, child: Text(c[0].toUpperCase() + c.substring(1)))),
                        const DropdownMenuItem(value: 'ADD_CUSTOM', child: Text('+ Add Custom Category', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold))),
                      ],
                      onChanged: (val) {
                        setDialogState(() {
                          if (val == 'ADD_CUSTOM') {
                            _isCustomCategory = true;
                            _category = '';
                          } else {
                            _category = val!;
                          }
                        });
                      },
                      decoration: const InputDecoration(labelText: 'Category'),
                    )
                  else
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _customCategoryController,
                            decoration: const InputDecoration(labelText: 'Custom Category *'),
                            onChanged: (val) => _category = val.toLowerCase().trim(),
                            validator: (v) => v!.isEmpty ? 'Required' : null,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => setDialogState(() {
                            _isCustomCategory = false;
                            _category = 'social';
                          }),
                        ),
                      ],
                    ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(value: _status, items: const [
                    DropdownMenuItem(value: 'upcoming', child: Text('Upcoming')),
                    DropdownMenuItem(value: 'ongoing', child: Text('Ongoing')),
                    DropdownMenuItem(value: 'completed', child: Text('Completed')),
                  ], onChanged: (val) => setDialogState(() => _status = val!), decoration: const InputDecoration(labelText: 'Status')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _location, decoration: const InputDecoration(labelText: 'Location')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _areaOfOperation, decoration: const InputDecoration(labelText: 'Area of Operation')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _targetBeneficiaries, decoration: const InputDecoration(labelText: 'Target Beneficiaries')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(value: _selectedPMId, items: pms.map((pm) => DropdownMenuItem<String>(value: pm['_id'], child: Text(pm['name']))).toList(), onChanged: (val) => setDialogState(() => _selectedPMId = val), decoration: const InputDecoration(labelText: 'Project Manager (Optional)')),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(value: _selectedSWId, items: sws.map((sw) => DropdownMenuItem<String>(value: sw['_id'], child: Text(sw['name']))).toList(), onChanged: (val) => setDialogState(() => _selectedSWId = val), decoration: const InputDecoration(labelText: 'Social Worker (Optional)')),
                ]),
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: () async {
                  if (!_formKey.currentState!.validate()) return;
                  try {
                    await _apiService.post('/projects', {
                      'title': _title.text, 'description': _description.text, 'category': _category, 'status': _status,
                      'location': _location.text, 'area_of_operation': _areaOfOperation.text, 'target_beneficiaries': _targetBeneficiaries.text,
                      'project_manager_id': _selectedPMId, 'social_worker_id': _selectedSWId,
                    });
                    Navigator.pop(context);
                    _loadDashboardData();
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                  }
                },
                child: const Text('Create'),
              ),
            ],
          );
        });
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
    String _category = project['category']?.toString().toLowerCase().trim() ?? 'social';
    bool _isCustomCategory = false;
    final _customCategoryController = TextEditingController(text: _category);

    String _status = project['status'] ?? 'upcoming';

    Uint8List? _selectedFileBytes;
    String? _fileName;
    bool _saving = false;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          final existingCategories = _projects
              .map((p) => p['category']?.toString().toLowerCase().trim() ?? '')
              .where((c) => c.isNotEmpty)
              .toSet()
              .toList();
          for (var c in ['social', 'economy', 'education']) {
            if (!existingCategories.contains(c)) existingCategories.add(c);
          }
          if (!existingCategories.contains(_category)) existingCategories.add(_category);

          return AlertDialog(
            title: Text('Edit "${project['title']}"'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _description, decoration: const InputDecoration(labelText: 'Description *'), maxLines: 3, validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  if (!_isCustomCategory)
                    DropdownButtonFormField<String>(
                      value: existingCategories.contains(_category) ? _category : existingCategories.first,
                      items: [
                        ...existingCategories.map((c) => DropdownMenuItem(value: c, child: Text(c[0].toUpperCase() + c.substring(1)))),
                        const DropdownMenuItem(value: 'ADD_CUSTOM', child: Text('+ Add Custom Category', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold))),
                      ],
                      onChanged: (val) {
                        setDialogState(() {
                          if (val == 'ADD_CUSTOM') {
                            _isCustomCategory = true;
                            _category = '';
                            _customCategoryController.clear();
                          } else {
                            _category = val!;
                          }
                        });
                      },
                      decoration: const InputDecoration(labelText: 'Category'),
                    )
                  else
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _customCategoryController,
                            decoration: const InputDecoration(labelText: 'Custom Category *'),
                            onChanged: (val) => _category = val.toLowerCase().trim(),
                            validator: (v) => v!.isEmpty ? 'Required' : null,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => setDialogState(() {
                            _isCustomCategory = false;
                            _category = existingCategories.first;
                          }),
                        ),
                      ],
                    ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(value: _status, items: const [
                    DropdownMenuItem(value: 'upcoming', child: Text('Upcoming')),
                    DropdownMenuItem(value: 'ongoing', child: Text('Ongoing')),
                    DropdownMenuItem(value: 'completed', child: Text('Completed')),
                  ], onChanged: (val) => setDialogState(() => _status = val!), decoration: const InputDecoration(labelText: 'Status')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _location, decoration: const InputDecoration(labelText: 'Location')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _areaOfOperation, decoration: const InputDecoration(labelText: 'Area of Operation')),
                  const SizedBox(height: 12),
                  TextFormField(controller: _targetBeneficiaries, decoration: const InputDecoration(labelText: 'Target Beneficiaries')),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.image),
                    label: Text(_fileName ?? 'Upload Project Image'),
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
                ]),
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: _saving ? null : () async {
                  if (!_formKey.currentState!.validate()) return;
                  setDialogState(() => _saving = true);
                  try {
                    await _apiService.put('/projects/${project['_id']}', {
                      'title': _title.text, 'description': _description.text, 'category': _category, 'status': _status,
                      'location': _location.text, 'area_of_operation': _areaOfOperation.text, 'target_beneficiaries': _targetBeneficiaries.text,
                    });

                    if (_selectedFileBytes != null) {
                      await _apiService.uploadFile(
                        '/projects/${project['_id']}/images',
                        _selectedFileBytes!,
                        _fileName ?? 'project_image.jpg',
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
        });
      },
    );
  }

  // ===========================================================================
  // BLOG
  // ===========================================================================
  Widget _buildBlogSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Blog & Outreach News', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            ElevatedButton.icon(onPressed: () => _showAddBlogDialog(), icon: const Icon(Icons.note_add), label: const Text('New Post')),
          ],
        ),
        const SizedBox(height: 24),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _blogs.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final post = _blogs[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundImage: post['cover_image'] != null && post['cover_image'].toString().isNotEmpty ? NetworkImage(post['cover_image']) : null,
                  child: post['cover_image'] == null || post['cover_image'].toString().isEmpty ? const Icon(Icons.newspaper) : null,
                ),
                title: Text(post['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('By ${post['author_name'] ?? 'Admin'}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(icon: const Icon(Icons.edit, color: AppTheme.secondaryColor), tooltip: 'Edit', onPressed: () => _showEditBlogDialog(post)),
                    IconButton(icon: const Icon(Icons.delete, color: AppTheme.errorColor), tooltip: 'Delete', onPressed: () => _deleteBlogPost(post['_id'])),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Future<void> _deleteBlogPost(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text('Are you sure you want to delete this blog post?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );
    if (confirm == true) {
      try {
        await _apiService.delete('/blog/$id');
        _loadDashboardData();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
      }
    }
  }

  void _showAddBlogDialog() {
    final _formKey = GlobalKey<FormState>();
    final _title = TextEditingController();
    final _content = TextEditingController();
    Uint8List? _selectedFileBytes;
    String? _fileName;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          return AlertDialog(
            title: const Text('Write News Update'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _content, decoration: const InputDecoration(labelText: 'Body Content *'), maxLines: 5, validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.image),
                    label: Text(_fileName ?? 'Select Cover Image'),
                    onPressed: () async {
                      final result = await FilePicker.platform.pickFiles(type: FileType.image);
                      if (result != null && result.files.single.bytes != null) {
                        setDialogState(() { _selectedFileBytes = result.files.single.bytes; _fileName = result.files.single.name; });
                      }
                    },
                  ),
                ]),
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: () async {
                  if (!_formKey.currentState!.validate()) return;
                  try {
                    final fields = {'title': _title.text, 'content': _content.text, 'published': 'true'};
                    if (_selectedFileBytes != null) {
                      await _apiService.uploadBlogCover('/blog', _selectedFileBytes!, _fileName ?? 'cover.jpg', 'image/jpeg', fields);
                    } else {
                      await _apiService.post('/blog', fields);
                    }
                    Navigator.pop(context);
                    _loadDashboardData();
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                  }
                },
                child: const Text('Publish'),
              ),
            ],
          );
        });
      },
    );
  }

  void _showEditBlogDialog(Map<String, dynamic> post) {
    final _formKey = GlobalKey<FormState>();
    final _title = TextEditingController(text: post['title'] ?? '');
    final _content = TextEditingController(text: post['content'] ?? '');
    Uint8List? _selectedFileBytes;
    String? _fileName;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setDialogState) {
          return AlertDialog(
            title: Text('Edit "${post['title']}"'),
            content: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  TextFormField(controller: _title, decoration: const InputDecoration(labelText: 'Title *'), validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 12),
                  TextFormField(controller: _content, decoration: const InputDecoration(labelText: 'Body Content *'), maxLines: 5, validator: (v) => v!.isEmpty ? 'Required' : null),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.image),
                    label: Text(_fileName ?? 'Change Cover Image (optional)'),
                    onPressed: () async {
                      final result = await FilePicker.platform.pickFiles(type: FileType.image);
                      if (result != null && result.files.single.bytes != null) {
                        setDialogState(() { _selectedFileBytes = result.files.single.bytes; _fileName = result.files.single.name; });
                      }
                    },
                  ),
                ]),
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: () async {
                  if (!_formKey.currentState!.validate()) return;
                  try {
                    final fields = {'title': _title.text, 'content': _content.text, 'published': 'true'};
                    if (_selectedFileBytes != null) {
                      await _apiService.uploadBlogCover('/blog/${post['_id']}', _selectedFileBytes!, _fileName ?? 'cover.jpg', 'image/jpeg', fields, isUpdate: true);
                    } else {
                      await _apiService.put('/blog/${post['_id']}', fields);
                    }
                    Navigator.pop(context);
                    _loadDashboardData();
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                  }
                },
                child: const Text('Save Changes'),
              ),
            ],
          );
        });
      },
    );
  }

  // ===========================================================================
  // SETTINGS
  // ===========================================================================
  Widget _buildSettingsSection() {
    final _state = TextEditingController();
    final _district = TextEditingController();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Global Settings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: SwitchListTile(
              title: const Text('Show All Projects on Home Page', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('If disabled, only projects explicitly toggled "Show on Home" will appear.'),
              value: _settings['show_all_projects_on_home'] == true,
              onChanged: (val) async {
                try {
                  await _apiService.put('/settings', {'show_all_projects_on_home': val});
                  _loadDashboardData();
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                }
              },
              activeColor: AppTheme.secondaryColor,
            ),
          ),
        ),
        const SizedBox(height: 48),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('State & District Registration', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
            ElevatedButton.icon(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Add Regional Bounds'),
                    content: Column(mainAxisSize: MainAxisSize.min, children: [
                      TextField(controller: _state, decoration: const InputDecoration(hintText: 'State Code e.g. AP')),
                      const SizedBox(height: 12),
                      TextField(controller: _district, decoration: const InputDecoration(hintText: 'District Code e.g. EG')),
                    ]),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                      ElevatedButton(
                        onPressed: () async {
                          if (_state.text.isEmpty || _district.text.isEmpty) return;
                          try {
                            await _apiService.post('/state-districts', {'state': _state.text.toUpperCase(), 'district': _district.text.toUpperCase()});
                            Navigator.pop(context);
                            _loadDashboardData();
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
                          }
                        },
                        child: const Text('Register Region'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.add_location_alt),
              label: const Text('Add Region'),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _stateDistricts.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final sd = _stateDistricts[index];
              return ListTile(
                leading: const Icon(Icons.location_on, color: AppTheme.secondaryColor),
                title: Text('${sd['state']} - ${sd['district']}'),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _SidebarItem {
  final String label;
  final IconData icon;
  const _SidebarItem(this.label, this.icon);
}
