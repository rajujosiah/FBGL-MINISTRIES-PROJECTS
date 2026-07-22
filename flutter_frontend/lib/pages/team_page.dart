import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/id_card_widget.dart';


class TeamPage extends StatefulWidget {
  const TeamPage({super.key});

  @override
  State<TeamPage> createState() => _TeamPageState();
}

class _TeamPageState extends State<TeamPage> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;

  List<dynamic> _boardMembers = [];
  List<dynamic> _areaManagers = [];
  List<dynamic> _projectManagers = [];
  List<dynamic> _socialWorkers = [];

  Map<String, dynamic>? _selectedAreaManager;
  Map<String, dynamic>? _selectedProjectManager;

  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadInitialData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadInitialData() async {
    setState(() => _loading = true);
    try {
      final bm = await _apiService.get('/profiles?role=board_member');
      final am = await _apiService.get('/profiles?role=area_manager');
      
      setState(() {
        _boardMembers = bm is List ? bm : [];
        _areaManagers = am is List ? am : [];
        _loading = false;
      });

      // Handle deep linking from route params if present
      _handleRouteParams();
    } catch (e) {
      print('Error loading team: $e');
      setState(() => _loading = false);
    }
  }

  void _handleRouteParams() {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final state = GoRouterState.of(context);
        final type = state.pathParameters['type'];
        final id = state.pathParameters['id'];

        if (type != null && id != null) {
          if (type == 'area_manager') {
            final manager = _areaManagers.firstWhere(
              (m) => m['id_no'].toString().replaceAll(' ', '').toUpperCase() == id.toUpperCase() || m['_id'] == id,
              orElse: () => null,
            );
            if (manager != null) {
              _selectAreaManager(manager);
            }
          } else if (type == 'project_manager') {
            // Fetch pm details
            final pm = await _apiService.get('/profiles/$id');
            if (pm != null) {
              if (pm['area_manager_id'] != null) {
                final String amId = pm['area_manager_id']['_id'] ?? pm['area_manager_id'];
                final parentAm = _areaManagers.firstWhere((m) => m['_id'] == amId, orElse: () => null);
                if (parentAm != null) {
                  _selectedAreaManager = parentAm;
                }
              }
              _selectProjectManager(pm);
            }
          } else if (type == 'social_worker') {
            // Fetch sw details
            final sw = await _apiService.get('/profiles/$id');
            if (sw != null) {
              if (sw['project_manager_id'] != null) {
                final String pmId = sw['project_manager_id']['_id'] ?? sw['project_manager_id'];
                final pm = await _apiService.get('/profiles/$pmId');
                
                if (pm != null) {
                  final String? amId = pm['area_manager_id'] is Map 
                      ? pm['area_manager_id']['_id'] 
                      : pm['area_manager_id'];
                      
                  if (amId != null) {
                    final am = _areaManagers.firstWhere((m) => m['_id'] == amId, orElse: () => null);
                    if (am != null) {
                      _selectedAreaManager = am;
                      final pmsList = await _apiService.get('/profiles?role=project_manager&areaManagerId=$amId');
                      setState(() {
                        _projectManagers = pmsList is List ? pmsList : [];
                      });
                    }
                  }
                  
                  _selectedProjectManager = pm;
                  final swsList = await _apiService.get('/profiles?role=social_worker&projectManagerId=$pmId');
                  setState(() {
                    _socialWorkers = swsList is List ? swsList : [];
                  });
                }
              }
              _tabController.animateTo(3); // Switch to Social Workers tab
            }
          }
        }
      } catch (e) {
        print('Error handling route params: $e');
      }
    });
  }

  Future<void> _selectAreaManager(Map<String, dynamic> am) async {
    setState(() {
      _selectedAreaManager = am;
      _selectedProjectManager = null;
      _projectManagers = [];
      _socialWorkers = [];
    });
    
    _tabController.animateTo(2); // Switch to Project Managers tab (index 2)

    try {
      final pms = await _apiService.get('/profiles?role=project_manager&areaManagerId=${am['_id']}');
      setState(() {
        _projectManagers = pms is List ? pms : [];
      });
    } catch (e) {
      print('Error loading project managers: $e');
    }
  }

  Future<void> _selectProjectManager(Map<String, dynamic> pm) async {
    setState(() {
      _selectedProjectManager = pm;
      _socialWorkers = [];
    });
    
    _tabController.animateTo(3); // Switch to Social Workers tab (index 3)

    try {
      final sws = await _apiService.get('/profiles?role=social_worker&projectManagerId=${pm['_id']}');
      setState(() {
        _socialWorkers = sws is List ? sws : [];
      });
    } catch (e) {
      print('Error loading social workers: $e');
    }
  }

  void _showIDCardDialog(Map<String, dynamic> profile) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Align(
                  alignment: Alignment.topRight,
                  child: IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 28),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
                const SizedBox(height: 8),
                IDCardWidget(profile: profile),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const SizedBox(
        height: 400,
        child: Center(child: CircularProgressIndicator()),
      );
    }

    return Column(
      children: [
        // Subtitle Banner
        Container(
          width: double.infinity,
          color: AppTheme.primaryColor,
          padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
          child: Column(
            children: [
              const Text(
                'Our Team Leadership',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Hierarchical leadership structure driving sustainable community change',
                style: TextStyle(color: Colors.grey[400], fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),

        // Tabs
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _tabController,
            labelColor: AppTheme.secondaryColor,
            unselectedLabelColor: AppTheme.textSecondary,
            indicatorColor: AppTheme.secondaryColor,
            tabs: const [
              Tab(icon: Icon(Icons.gavel), text: 'Board Members'),
              Tab(icon: Icon(Icons.map), text: 'Area Managers'),
              Tab(icon: Icon(Icons.business_center), text: 'Project Managers'),
              Tab(icon: Icon(Icons.diversity_3), text: 'Social Workers'),
            ],
          ),
        ),

        // Tab views content
        Container(
          height: 600,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: TabBarView(
            controller: _tabController,
            children: [
              // 1. Board Members
              _buildBoardMembersTab(),
              // 2. Area Managers
              _buildAreaManagersTab(),
              // 3. Project Managers
              _buildProjectManagersTab(),
              // 4. Social Workers
              _buildSocialWorkersTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBoardMembersTab() {
    if (_boardMembers.isEmpty) {
      return const Center(child: Text('No board members found'));
    }

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 320,
        mainAxisSpacing: 24,
        crossAxisSpacing: 24,
        childAspectRatio: 0.8,
      ),
      itemCount: _boardMembers.length,
      itemBuilder: (context, index) {
        final bm = _boardMembers[index];
        return _buildTeamCard(bm, showCardButton: false);
      },
    );
  }

  Widget _buildAreaManagersTab() {
    if (_areaManagers.isEmpty) {
      return const Center(child: Text('No area managers registered yet'));
    }

    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 320,
        mainAxisSpacing: 24,
        crossAxisSpacing: 24,
        childAspectRatio: 0.75,
      ),
      itemCount: _areaManagers.length,
      itemBuilder: (context, index) {
        final am = _areaManagers[index];
        return _buildTeamCard(
          am,
          onTap: () => _selectAreaManager(am),
          buttonText: 'View Reporting PMs',
        );
      },
    );
  }

  Widget _buildProjectManagersTab() {
    if (_selectedAreaManager == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.map, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: 16),
            const Text(
              'Please select an Area Manager first to view their Project Managers.',
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => _tabController.animateTo(1),
              child: const Text('Go to Area Managers'),
            ),
          ],
        ),
      );
    }

    if (_projectManagers.isEmpty) {
      return Center(
        child: Text('No project managers report to ${_selectedAreaManager!['name']}'),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Chip(
          avatar: const Icon(Icons.arrow_back),
          label: Text('Area Manager: ${_selectedAreaManager!['name']}'),
          onDeleted: () {
            setState(() {
              _selectedAreaManager = null;
              _projectManagers = [];
            });
          },
        ),
        const SizedBox(height: 16),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 320,
              mainAxisSpacing: 24,
              crossAxisSpacing: 24,
              childAspectRatio: 0.75,
            ),
            itemCount: _projectManagers.length,
            itemBuilder: (context, index) {
              final pm = _projectManagers[index];
              return _buildTeamCard(
                pm,
                onTap: () => _selectProjectManager(pm),
                buttonText: 'View Social Workers',
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSocialWorkersTab() {
    if (_selectedProjectManager == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.business_center, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: 16),
            const Text(
              'Please select a Project Manager first to view their Social Workers.',
              style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                if (_selectedAreaManager == null) {
                  _tabController.animateTo(1);
                } else {
                  _tabController.animateTo(2);
                }
              },
              child: const Text('Go back to hierarchy'),
            ),
          ],
        ),
      );
    }

    if (_socialWorkers.isEmpty) {
      return Center(
        child: Text('No social workers report to ${_selectedProjectManager!['name']}'),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Chip(
          avatar: const Icon(Icons.arrow_back),
          label: Text('Project Manager: ${_selectedProjectManager!['name']}'),
          onDeleted: () {
            setState(() {
              _selectedProjectManager = null;
              _socialWorkers = [];
            });
          },
        ),
        const SizedBox(height: 16),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 320,
              mainAxisSpacing: 24,
              crossAxisSpacing: 24,
              childAspectRatio: 0.75,
            ),
            itemCount: _socialWorkers.length,
            itemBuilder: (context, index) {
              final sw = _socialWorkers[index];
              return _buildTeamCard(
                sw, 
                showCardButton: true,
                buttonText: 'View Assigned Projects',
                onTap: () => _showSocialWorkerProjects(sw),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTeamCard(
    Map<String, dynamic> member, {
    VoidCallback? onTap,
    String? buttonText,
    bool showCardButton = true,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile image circle
            CircleAvatar(
              radius: 40,
              backgroundImage: (member['profile_picture'] != null && member['profile_picture'].toString().isNotEmpty)
                  ? NetworkImage(member['profile_picture'])
                  : null,
              child: (member['profile_picture'] == null || member['profile_picture'].toString().isEmpty)
                  ? const Icon(Icons.person, size: 40)
                  : null,
            ),
            const SizedBox(height: 12),
            Text(
              member['name'] ?? 'Staff',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primaryColor),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              member['position'] ?? member['id_no'] ?? 'Staff Member',
              style: const TextStyle(color: AppTheme.secondaryColor, fontSize: 12, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Text(
                member['bio'] ?? 'Dedicated member of FIRST BORN GOSPEL LIFE MINISTRIES, serving the communities.',
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                textAlign: TextAlign.center,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 12),
            // Actions
            if (onTap != null && buttonText != null)
              ElevatedButton(
                onPressed: onTap,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  textStyle: const TextStyle(fontSize: 12),
                ),
                child: Text(buttonText),
              ),
            if (showCardButton && member['role'] != 'board_member') ...[
              const SizedBox(height: 8),
              OutlinedButton.icon(
                onPressed: () => _showIDCardDialog(member),
                icon: const Icon(Icons.badge, size: 14),
                label: const Text('View ID Card', style: TextStyle(fontSize: 11)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.primaryColor,
                  side: const BorderSide(color: AppTheme.primaryColor),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }
  void _showSocialWorkerProjects(Map<String, dynamic> sw) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          child: Container(
            width: 600,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Projects assigned to ${sw['name']}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
                  ],
                ),
                const SizedBox(height: 16),
                FutureBuilder<dynamic>(
                  future: _apiService.get('/projects?socialWorkerId=${sw['_id']}'),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()));
                    }
                    if (snapshot.hasError) {
                      return Center(child: Text('Error loading projects: ${snapshot.error}'));
                    }
                    
                    final projects = snapshot.data as List<dynamic>? ?? [];
                    if (projects.isEmpty) {
                      return const Center(child: Padding(padding: EdgeInsets.all(32), child: Text('No projects assigned to this Social Worker.')));
                    }

                    return SizedBox(
                      height: 400,
                      child: ListView.builder(
                        itemCount: projects.length,
                        itemBuilder: (context, index) {
                          final project = projects[index];
                          final List images = project['images'] ?? [];
                          final String? coverImage = images.isNotEmpty ? images[0] : null;

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 2,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () {
                                Navigator.pop(context);
                                context.push('/projects/${project['_id']}');
                              },
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), bottomLeft: Radius.circular(12)),
                                    child: coverImage != null && coverImage.toString().isNotEmpty
                                        ? Image.network(
                                            coverImage,
                                            width: 100,
                                            height: 100,
                                            fit: BoxFit.cover,
                                            errorBuilder: (_, __, ___) => _buildFallbackImage(),
                                          )
                                        : _buildFallbackImage(),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            project['title'] ?? '',
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Category: ${project['category'].toString().toUpperCase()} • Status: ${project['status'].toString().toUpperCase()}',
                                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  const Padding(
                                    padding: EdgeInsets.all(16),
                                    child: Icon(Icons.arrow_forward_ios, color: AppTheme.secondaryColor, size: 16),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFallbackImage() {
    return Container(
      width: 100,
      height: 100,
      color: AppTheme.primaryColor.withValues(alpha: 0.1),
      child: const Icon(Icons.work, color: AppTheme.primaryColor, size: 32),
    );
  }

}
