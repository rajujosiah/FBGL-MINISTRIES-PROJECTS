import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
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
    // Read route query parameters if they change (e.g. category filter from Home focus areas)
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
      print('Error fetching projects: $e');
      setState(() => _loading = false);
    }
  }

  List<dynamic> _getFilteredProjects() {
    return _projects.where((project) {
      // Category filter
      if (_selectedCategory != 'all' && project['category'] != _selectedCategory) {
        return false;
      }
      // Status filter
      if (_selectedStatus != 'all' && project['status'] != _selectedStatus) {
        return false;
      }
      // Search query
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
                'Our Ministries Projects',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Browse our social, educational, and economic initiatives empowering communities',
                style: TextStyle(color: Colors.grey[400], fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),

        // Filters Section
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1100),
              child: Wrap(
                spacing: 24,
                runSpacing: 16,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  // Search Field
                  SizedBox(
                    width: isMobile ? double.infinity : 300,
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Search projects...',
                        prefixIcon: const Icon(Icons.search),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        fillColor: AppTheme.backgroundColor,
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                    ),
                  ),

                  // Category Filter Row
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildCategoryChip('All', 'all'),
                      _buildCategoryChip('Social', 'social'),
                      _buildCategoryChip('Economy', 'economy'),
                      _buildCategoryChip('Education', 'education'),
                    ],
                  ),

                  // Status Filter Dropdown
                  DropdownButtonHideUnderline(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: DropdownButton<String>(
                        value: _selectedStatus,
                        items: const [
                          DropdownMenuItem(value: 'all', child: Text('All Statuses')),
                          DropdownMenuItem(value: 'upcoming', child: Text('Upcoming')),
                          DropdownMenuItem(value: 'ongoing', child: Text('Ongoing')),
                          DropdownMenuItem(value: 'completed', child: Text('Completed')),
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

        // Projects Grid
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
          constraints: const BoxConstraints(minHeight: 400),
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : filteredProjects.isEmpty
                  ? const Center(
                      child: Text(
                        'No projects match your filter criteria.',
                        style: TextStyle(fontSize: 16, color: AppTheme.textSecondary),
                      ),
                    )
                  : Center(
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 1100),
                        child: GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: isMobile ? 1 : 3,
                            mainAxisSpacing: 32,
                            crossAxisSpacing: 32,
                            childAspectRatio: 0.75,
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
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppTheme.textPrimary,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildProjectCard(Map<String, dynamic> project) {
    final String image = (project['images'] is List && (project['images'] as List).isNotEmpty)
        ? (project['images'] as List)[0]
        : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024';

    Color statusColor;
    switch (project['status']) {
      case 'completed':
        statusColor = AppTheme.successColor;
        break;
      case 'ongoing':
        statusColor = Colors.blue;
        break;
      default:
        statusColor = Colors.orange;
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Project image & category tag
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
                  child: const Icon(Icons.broken_image, color: Colors.white38, size: 48),
                ),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    project['category'].toString().toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),

          // Content body
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status & Location
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          project['status'].toString().toUpperCase(),
                          style: TextStyle(color: statusColor, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 12, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            project['location'] ?? 'India',
                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    project['title'] ?? 'Project Title',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Description snippet
                  Expanded(
                    child: Text(
                      project['description'] ?? '',
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Action Button
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => context.go('/projects/${project['_id']}'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: AppTheme.secondaryColor),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text(
                        'Learn More',
                        style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
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
