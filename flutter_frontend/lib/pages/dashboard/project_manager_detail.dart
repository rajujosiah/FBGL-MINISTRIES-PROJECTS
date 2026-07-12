import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/api_service.dart';
import '../../theme.dart';
import '../../widgets/responsive_layout.dart';

class ProjectManagerDetail extends StatefulWidget {
  const ProjectManagerDetail({super.key});

  @override
  State<ProjectManagerDetail> createState() => _ProjectManagerDetailState();
}

class _ProjectManagerDetailState extends State<ProjectManagerDetail> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _pmProfile;
  List<dynamic> _socialWorkers = [];
  List<dynamic> _projects = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.didChangeDependencies();
    _loadProjectManagerDetails();
  }

  Future<void> _loadProjectManagerDetails() async {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final id = GoRouterState.of(context).pathParameters['id'];
        if (id == null) {
          setState(() {
            _error = 'Project Manager ID is missing';
            _loading = false;
          });
          return;
        }

        // Fetch PM profile
        final pmData = await _apiService.get('/profiles/$id');
        
        // Fetch PM's Social Workers
        final swsData = await _apiService.get('/profiles?role=social_worker&projectManagerId=$id');
        
        // Fetch projects managed by this PM
        final projData = await _apiService.get('/projects?projectManagerId=$id');

        setState(() {
          _pmProfile = pmData;
          _socialWorkers = swsData is List ? swsData : [];
          _projects = projData is List ? projData : [];
          _loading = false;
        });
      } catch (e) {
        print('Error loading PM detail: $e');
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
          _loading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);

    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_error != null || _pmProfile == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail View')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: AppTheme.errorColor),
              const SizedBox(height: 16),
              Text(_error ?? 'Project Manager details not found'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.pop(),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('${_pmProfile!['name']}\'s Profile'),
        backgroundColor: AppTheme.primaryColor,
      ),
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1100),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Back Button
              TextButton.icon(
                onPressed: () => context.pop(),
                icon: const Icon(Icons.arrow_back, color: AppTheme.secondaryColor),
                label: const Text('Back', style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 16),

              // Staff Brief Panel
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundImage: (_pmProfile!['profile_picture'] != null && _pmProfile!['profile_picture'].toString().isNotEmpty)
                            ? NetworkImage(_pmProfile!['profile_picture'])
                            : null,
                        child: _pmProfile!['profile_picture'] == null ? const Icon(Icons.person, size: 36) : null,
                      ),
                      const SizedBox(width: 24),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _pmProfile!['name'] ?? '',
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'PROJECT MANAGER • ID: ${_pmProfile!['id_no'] ?? 'N/A'}',
                              style: const TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Region: ${_pmProfile!['district'] ?? 'N/A'}, ${_pmProfile!['state'] ?? 'N/A'} • Email: ${_pmProfile!['email'] ?? 'N/A'}',
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // PM Stats Section
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard('Assigned Social Workers', '${_socialWorkers.length}', Icons.diversity_3, Colors.teal),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard('Total Projects Managed', '${_projects.length}', Icons.work, Colors.blue),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard('Ongoing Projects', '${_projects.where((p) => p['status'] == 'ongoing' || p['status'] == 'Ongoing').length}', Icons.play_arrow, Colors.orange),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Layout list
              Expanded(
                child: ResponsiveLayout(
                  mobile: Column(
                    children: [
                      Expanded(child: _buildSWsCard()),
                      const SizedBox(height: 32),
                      Expanded(child: _buildProjectsCard()),
                    ],
                  ),
                  desktop: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(flex: 3, child: _buildSWsCard()),
                      const SizedBox(width: 32),
                      Expanded(flex: 2, child: _buildProjectsCard()),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String count, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        child: Row(
          children: [
            Icon(icon, size: 28, color: color),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(count, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
                Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSWsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Reporting Social Workers',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _socialWorkers.isEmpty
                  ? const Center(child: Text('No social workers reporting to this PM.'))
                  : ListView.separated(
                      itemCount: _socialWorkers.length,
                      separatorBuilder: (_, __) => const Divider(),
                      itemBuilder: (context, index) {
                        final sw = _socialWorkers[index];
                        return ListTile(
                          leading: const CircleAvatar(child: Icon(Icons.person)),
                          title: Text(sw['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('ID: ${sw['id_no'] ?? 'N/A'} • Phone: ${sw['phone'] ?? 'N/A'}'),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Assigned Projects',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _projects.isEmpty
                  ? const Center(child: Text('No projects managed by this PM.'))
                  : ListView.separated(
                      itemCount: _projects.length,
                      separatorBuilder: (_, __) => const Divider(),
                      itemBuilder: (context, index) {
                        final project = _projects[index];
                        final swName = project['social_worker_id'] is Map ? project['social_worker_id']['name'] : 'Unassigned';

                        return ListTile(
                          title: Text(project['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('Cat: ${project['category'].toString().toUpperCase()} • SW: $swName'),
                          trailing: Text(
                            project['status'].toString().toUpperCase(),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.secondaryColor),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
