import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_html/html.dart' as html;
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({super.key});

  @override
  State<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> {
  final ApiService _apiService = ApiService();
  List<dynamic> _projects = [];
  bool _loading = true;
  String _selectedCategory = 'all';
  String _selectedStatus = 'all';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadProjects();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    try {
      final state = GoRouterState.of(context);
      final category = state.uri.queryParameters['category'];
      if (category != null && category.isNotEmpty) {
        setState(() {
          _selectedCategory = category;
        });
      }
    } catch (_) {}
  }

  Future<void> _loadProjects() async {
    setState(() => _loading = true);
    try {
      final response = await _apiService.get('/projects');
      if (response is List) {
        setState(() {
          _projects = response;
          _loading = false;
        });
      }
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  void _shareProject(BuildContext context, String projectId, String projectTitle) {
    try {
      final String origin = html.window.location.origin;
      final String shareUrl = '$origin/projects/$projectId';
      html.window.navigator.clipboard?.writeText(shareUrl);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.white, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Copied link for "$projectTitle"!',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          backgroundColor: AppTheme.successColor,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          duration: const Duration(seconds: 3),
        ),
      );
    } catch (_) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to copy link')),
      );
    }
  }

  List<dynamic> _getFilteredProjects() {
    return _projects.where((project) {
      if (_selectedCategory != 'all' && project['category'] != _selectedCategory) {
        return false;
      }
      if (_selectedStatus != 'all' && project['status'] != _selectedStatus) {
        return false;
      }
      if (_searchQuery.isNotEmpty) {
        final title = (project['title'] ?? '').toString().toLowerCase();
        final desc = (project['description'] ?? '').toString().toLowerCase();
        final query = _searchQuery.toLowerCase();
        if (!title.contains(query) && !desc.contains(query)) {
          return false;
        }
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filteredProjects = _getFilteredProjects();
    final bool isMobile = ResponsiveLayout.isMobile(context);
    final bool isTablet = ResponsiveLayout.isTablet(context);

    int crossAxisCount = 3;
    if (isMobile) {
      crossAxisCount = 1;
    } else if (isTablet) {
      crossAxisCount = 2;
    }

    return Column(
      children: [
        // Hero Header Banner
        Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: AppTheme.navyGradient,
          ),
          padding: EdgeInsets.symmetric(
            vertical: isMobile ? 36 : 56,
            horizontal: isMobile ? 16 : 24,
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: AppTheme.secondaryColor.withValues(alpha: 0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.workspace_premium, color: AppTheme.secondaryColor, size: 16),
                    SizedBox(width: 8),
                    Text(
                      'COMMUNITY IMPACT PROJECTS',
                      style: TextStyle(
                        color: AppTheme.secondaryColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Transforming Lives Through Action',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: isMobile ? 28 : 40,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 700),
                child: Text(
                  'Discover our educational, economic, and social development initiatives empowering individuals and families across East Godavari.',
                  style: TextStyle(
                    color: Colors.grey[300],
                    fontSize: isMobile ? 14 : 16,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),

        // Filter Bar Section
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1200),
              child: Wrap(
                spacing: 16,
                runSpacing: 16,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  // Search Input
                  SizedBox(
                    width: isMobile ? double.infinity : 280,
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Search projects...',
                        prefixIcon: const Icon(Icons.search, color: AppTheme.textSecondary),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        fillColor: AppTheme.backgroundColor,
                        isDense: true,
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                    ),
                  ),

                  // Category Chips Row
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildCategoryChip('All Categories', 'all'),
                      _buildCategoryChip('Social', 'social'),
                      _buildCategoryChip('Economy', 'economy'),
                      _buildCategoryChip('Education', 'education'),
                    ],
                  ),

                  // Status Dropdown
                  DropdownButtonHideUnderline(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: DropdownButton<String>(
                        value: _selectedStatus,
                        icon: const Icon(Icons.keyboard_arrow_down, color: AppTheme.textSecondary),
                        items: const [
                          DropdownMenuItem(value: 'all', child: Text('All Statuses', style: TextStyle(fontSize: 13))),
                          DropdownMenuItem(value: 'upcoming', child: Text('Upcoming', style: TextStyle(fontSize: 13))),
                          DropdownMenuItem(value: 'ongoing', child: Text('Ongoing', style: TextStyle(fontSize: 13))),
                          DropdownMenuItem(value: 'completed', child: Text('Completed', style: TextStyle(fontSize: 13))),
                        ],
                        onChanged: (val) {
                          if (val != null) {
                            setState(() => _selectedStatus = val);
                          }
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Projects Grid Section
        Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 16 : 24,
            vertical: 40,
          ),
          constraints: const BoxConstraints(minHeight: 450),
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : filteredProjects.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.folder_off, size: 64, color: AppTheme.textSecondary.withValues(alpha: 0.5)),
                          const SizedBox(height: 16),
                          const Text(
                            'No projects match your criteria.',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Try resetting search or filter options.',
                            style: TextStyle(color: AppTheme.textSecondary),
                          ),
                        ],
                      ),
                    )
                  : Center(
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 1200),
                        child: GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: crossAxisCount,
                            mainAxisSpacing: 28,
                            crossAxisSpacing: 28,
                            childAspectRatio: isMobile ? 0.82 : 0.76,
                          ),
                          itemCount: filteredProjects.length,
                          itemBuilder: (context, index) {
                            final project = filteredProjects[index];
                            return _buildProjectCard(project);
                          },
                        ),
                      ),
                    ),
        ),
      ],
    );
  }

  Widget _buildCategoryChip(String label, String value) {
    final bool isSelected = _selectedCategory == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() => _selectedCategory = value);
        }
      },
      selectedColor: AppTheme.primaryColor,
      backgroundColor: AppTheme.backgroundColor,
      elevation: isSelected ? 2 : 0,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppTheme.textPrimary,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
        fontSize: 13,
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: isSelected ? AppTheme.primaryColor : const Color(0xFFE2E8F0),
        ),
      ),
    );
  }

  Widget _buildProjectCard(Map<String, dynamic> project) {
    final String image = (project['images'] is List && (project['images'] as List).isNotEmpty)
        ? (project['images'] as List)[0]
        : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024';

    final String projectId = project['_id'] ?? '';
    final String projectTitle = project['title'] ?? 'Project';

    Color statusColor;
    switch (project['status']) {
      case 'completed':
        statusColor = AppTheme.successColor;
        break;
      case 'ongoing':
        statusColor = Colors.blue;
        break;
      default:
        statusColor = AppTheme.secondaryColor;
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Project Image & Floating Badges
          Stack(
            children: [
              Image.network(
                image,
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 180,
                  color: AppTheme.primaryColor,
                  alignment: Alignment.center,
                  child: const Icon(Icons.work, color: Colors.white38, size: 48),
                ),
              ),

              // Category Badge
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Text(
                    project['category'].toString().toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
              ),

              // Share Button Badge (Top Right)
              Positioned(
                top: 10,
                right: 10,
                child: Material(
                  color: Colors.white.withValues(alpha: 0.9),
                  shape: const CircleBorder(),
                  elevation: 4,
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: () => _shareProject(context, projectId, projectTitle),
                    child: const Padding(
                      padding: EdgeInsets.all(8),
                      child: Icon(
                        Icons.share_outlined,
                        size: 18,
                        color: AppTheme.primaryColor,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Content Details
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status & Location Bar
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: statusColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          project['status'].toString().toUpperCase(),
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 13, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            project['location'] ?? 'East Godavari, AP',
                            style: const TextStyle(
                              color: AppTheme.textSecondary,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Project Title
                  Text(
                    projectTitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                      fontFamily: 'Outfit',
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Description Body
                  Expanded(
                    child: Text(
                      project['description'] ?? '',
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        height: 1.45,
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Action Buttons Row (Learn More + Share Icon Button)
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => context.go('/projects/$projectId'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            side: const BorderSide(color: AppTheme.secondaryColor, width: 1.5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            'Learn More',
                            style: TextStyle(
                              color: AppTheme.secondaryColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton.filledTonal(
                        onPressed: () => _shareProject(context, projectId, projectTitle),
                        icon: const Icon(Icons.share, size: 18),
                        style: IconButton.styleFrom(
                          backgroundColor: AppTheme.primaryColor.withValues(alpha: 0.08),
                          foregroundColor: AppTheme.primaryColor,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        tooltip: 'Share project link',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
