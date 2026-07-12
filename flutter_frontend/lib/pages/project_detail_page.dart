import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class ProjectDetailPage extends StatefulWidget {
  const ProjectDetailPage({super.key});

  @override
  State<ProjectDetailPage> createState() => _ProjectDetailPageState();
}

class _ProjectDetailPageState extends State<ProjectDetailPage> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _project;
  bool _loading = true;
  String? _error;

  late PageController _pageController;
  Timer? _carouselTimer;
  int _currentCarouselIndex = 0;

  @override
  void initState() {
    super.didChangeDependencies();
    _pageController = PageController();
    _loadProjectDetails();
  }

  void _startCarouselTimer(int imageCount) {
    _carouselTimer?.cancel();
    if (imageCount > 1) {
      _carouselTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
        if (_pageController.hasClients) {
          int nextPage = (_pageController.page?.round() ?? 0) + 1;
          if (nextPage >= imageCount) {
            nextPage = 0;
            _pageController.animateToPage(nextPage, duration: const Duration(milliseconds: 600), curve: Curves.easeInOut);
          } else {
            _pageController.animateToPage(nextPage, duration: const Duration(milliseconds: 500), curve: Curves.easeInOut);
          }
        }
      });
    }
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _loadProjectDetails() async {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final id = GoRouterState.of(context).pathParameters['id'];
        if (id == null) {
          setState(() {
            _error = 'Project ID is missing';
            _loading = false;
          });
          return;
        }

        final data = await _apiService.get('/projects/$id');
        setState(() {
          _project = data;
          _loading = false;
        });
        final images = data['images'] as List? ?? [];
        _startCarouselTimer(images.length);
      } catch (e) {
        print('Error loading project: $e');
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
      return const SizedBox(
        height: 400,
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null || _project == null) {
      return SizedBox(
        height: 400,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: AppTheme.errorColor),
              const SizedBox(height: 16),
              Text(_error ?? 'Project not found', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/projects'),
                child: const Text('Back to Projects'),
              ),
            ],
          ),
        ),
      );
    }

    Color statusColor;
    switch (_project!['status']) {
      case 'completed':
        statusColor = AppTheme.successColor;
        break;
      case 'ongoing':
        statusColor = Colors.blue;
        break;
      default:
        statusColor = Colors.orange;
    }

    final List images = _project!['images'] ?? [];

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 1000),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton.icon(
                  onPressed: () => context.go('/projects'),
                  icon: const Icon(Icons.arrow_back, color: AppTheme.secondaryColor),
                  label: const Text('Back to Projects', style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold)),
                ),
                ElevatedButton.icon(
                  onPressed: () => context.go('/donate'),
                  icon: const Icon(Icons.favorite),
                  label: const Text('Donate Now'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Hero Title Segment
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _project!['title'] ?? '',
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryColor,
                          fontFamily: 'Outfit',
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Meta details
                      Wrap(
                        spacing: 16,
                        runSpacing: 8,
                        children: [
                          Chip(
                            label: Text(_project!['category'].toString().toUpperCase()),
                            backgroundColor: AppTheme.primaryColor.withOpacity(0.08),
                          ),
                          Chip(
                            label: Text(_project!['status'].toString().toUpperCase()),
                            backgroundColor: statusColor.withOpacity(0.08),
                            labelStyle: TextStyle(color: statusColor, fontWeight: FontWeight.bold),
                          ),
                          if (_project!['location'] != null)
                            Chip(
                              avatar: const Icon(Icons.location_on, size: 14),
                              label: Text(_project!['location']),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Layout row
            ResponsiveLayout(
              mobile: Column(
                children: [
                  _buildMainBanner(images),
                  const SizedBox(height: 32),
                  _buildProjectDetails(),
                  const SizedBox(height: 32),
                  _buildStaffCard(),
                ],
              ),
              desktop: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMainBanner(images),
                        const SizedBox(height: 32),
                        _buildProjectDetails(),
                      ],
                    ),
                  ),
                  const SizedBox(width: 48),
                  Expanded(
                    flex: 1,
                    child: _buildStaffCard(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMainBanner(List images) {
    if (images.isEmpty) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Image.network(
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024',
          height: 400,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            height: 400,
            color: AppTheme.primaryColor,
            alignment: Alignment.center,
            child: const Icon(Icons.broken_image, color: Colors.white38, size: 64),
          ),
        ),
      );
    }

    if (images.length == 1) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Image.network(
          images[0],
          height: 400,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            height: 400,
            color: AppTheme.primaryColor,
            alignment: Alignment.center,
            child: const Icon(Icons.broken_image, color: Colors.white38, size: 64),
          ),
        ),
      );
    }

    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: SizedBox(
            height: 400,
            width: double.infinity,
            child: PageView.builder(
              controller: _pageController,
              itemCount: images.length,
              onPageChanged: (index) {
                setState(() {
                  _currentCarouselIndex = index;
                });
              },
              itemBuilder: (context, index) {
                return Image.network(
                  images[index],
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: AppTheme.primaryColor,
                    alignment: Alignment.center,
                    child: const Icon(Icons.broken_image, color: Colors.white38, size: 64),
                  ),
                );
              },
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(images.length, (index) {
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentCarouselIndex == index ? 16 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentCarouselIndex == index ? AppTheme.secondaryColor : Colors.grey.shade400,
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildProjectDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('About the Project', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
        const SizedBox(height: 16),
        Text(
          _project!['description'] ?? '',
          style: const TextStyle(fontSize: 16, color: AppTheme.textPrimary, height: 1.6),
        ),
        const SizedBox(height: 32),
        const Divider(),
        const SizedBox(height: 16),
        if (_project!['area_of_operation'] != null) ...[
          _buildMetaDetailItem('Area of Operation:', _project!['area_of_operation']),
          const SizedBox(height: 12),
        ],
        if (_project!['target_beneficiaries'] != null) ...[
          _buildMetaDetailItem('Target Beneficiaries:', _project!['target_beneficiaries']),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _buildMetaDetailItem(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.primaryColor),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 15, color: AppTheme.textSecondary),
          ),
        ),
      ],
    );
  }

  Widget _buildStaffCard() {
    final pm = _project!['project_manager_id'];
    final sw = _project!['social_worker_id'];
    final am = pm != null ? pm['area_manager_id'] : null;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Assigned Personnel',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
          ),
          const SizedBox(height: 24),
          // Area Manager
          _buildStaffItem(
            roleLabel: 'Area Manager',
            name: am != null ? am['name'] : 'Not Assigned',
            idNo: am != null ? am['id_no'] : null,
            icon: Icons.location_on,
            onTap: am != null ? () => context.go('/team/area_manager/${am['id_no'] ?? am['_id']}') : null,
          ),
          const SizedBox(height: 24),
          const Divider(),
          const SizedBox(height: 24),

          // Project Manager
          _buildStaffItem(
            roleLabel: 'Project Manager',
            name: pm != null ? pm['name'] : 'Not Assigned',
            idNo: pm != null ? pm['id_no'] : null,
            icon: Icons.business_center,
            onTap: pm != null ? () => context.go('/team/project_manager/${pm['id_no'] ?? pm['_id']}') : null,
          ),
          const SizedBox(height: 24),
          const Divider(),
          const SizedBox(height: 24),

          // Social Worker
          _buildStaffItem(
            roleLabel: 'Social Worker',
            name: sw != null ? sw['name'] : 'Not Assigned',
            idNo: sw != null ? sw['id_no'] : null,
            icon: Icons.diversity_3,
            onTap: sw != null ? () => context.go('/team/social_worker/${sw['id_no'] ?? sw['_id']}') : null,
          ),
        ],
      ),
    );
  }

  Widget _buildStaffItem({
    required String roleLabel,
    required String name,
    String? idNo,
    required IconData icon,
    VoidCallback? onTap,
  }) {
    return Row(
      children: [
        CircleAvatar(
          backgroundColor: AppTheme.secondaryColor.withOpacity(0.1),
          child: Icon(icon, color: AppTheme.secondaryColor),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(roleLabel, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
              Text(
                name,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: onTap != null ? AppTheme.secondaryColor : AppTheme.primaryColor,
                  decoration: onTap != null ? TextDecoration.underline : null,
                ),
              ),
              if (idNo != null)
                Text(
                  'ID: $idNo',
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                ),
            ],
          ),
        ),
        if (onTap != null)
          IconButton(
            icon: const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.secondaryColor),
            onPressed: onTap,
          ),
      ],
    );
  }

}
