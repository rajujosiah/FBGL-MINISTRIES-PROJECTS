import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_html/html.dart' as html;
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
    super.initState();
    _pageController = PageController();
    _loadProjectDetails();
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startCarouselTimer(int imageCount) {
    _carouselTimer?.cancel();
    if (imageCount > 1) {
      _carouselTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
        if (_pageController.hasClients) {
          int nextIndex = (_currentCarouselIndex + 1) % imageCount;
          _pageController.animateToPage(
            nextIndex,
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeInOut,
          );
        }
      });
    }
  }

  Future<void> _loadProjectDetails() async {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final id = GoRouterState.of(context).pathParameters['id'];
        if (id == null) {
          setState(() {
            _error = 'Project ID missing';
            _loading = false;
          });
          return;
        }

        final data = await _apiService.get('/projects/$id');
        setState(() {
          _project = data;
          _loading = false;
        });

        final List images = data['images'] ?? [];
        if (images.isNotEmpty) {
          _startCarouselTimer(images.length);
        }
      } catch (e) {
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
          _loading = false;
        });
      }
    });
  }

  void _shareProjectLink() {
    try {
      final String origin = html.window.location.origin;
      final String projectId = _project?['_id'] ?? '';
      final String projectTitle = _project?['title'] ?? 'Project';
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
        const SnackBar(content: Text('Failed to copy project link')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);

    if (_loading) {
      return const SizedBox(
        height: 500,
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null || _project == null) {
      return SizedBox(
        height: 450,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 56, color: AppTheme.errorColor),
              const SizedBox(height: 16),
              Text(_error ?? 'Project not found', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => context.go('/projects'),
                icon: const Icon(Icons.arrow_back),
                label: const Text('Back to Projects'),
              ),
            ],
          ),
        ),
      );
    }

    final List images = _project!['images'] ?? [];
    final String defaultImage = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024';

    Color statusColor;
    switch (_project!['status']) {
      case 'completed':
        statusColor = AppTheme.successColor;
        break;
      case 'ongoing':
        statusColor = Colors.blue;
        break;
      default:
        statusColor = AppTheme.secondaryColor;
    }

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 1000),
        padding: EdgeInsets.symmetric(
          horizontal: isMobile ? 16 : 24,
          vertical: 40,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Navigation & Action Row
            Wrap(
              spacing: 16,
              runSpacing: 12,
              alignment: WrapAlignment.spaceBetween,
              crossAlignment: WrapCrossAlignment.center,
              children: [
                TextButton.icon(
                  onPressed: () => context.go('/projects'),
                  icon: const Icon(Icons.arrow_back, color: AppTheme.secondaryColor),
                  label: const Text(
                    'Back to Projects Listing',
                    style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold),
                  ),
                ),
                Wrap(
                  spacing: 12,
                  runSpacing: 8,
                  children: [
                    OutlinedButton.icon(
                      onPressed: _shareProjectLink,
                      icon: const Icon(Icons.share, size: 16),
                      label: const Text('Share Project'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () => context.go('/donate'),
                      icon: const Icon(Icons.favorite, size: 16),
                      label: const Text('Support Project'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondaryColor,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Title & Meta Badges
            Text(
              _project!['title'] ?? '',
              style: TextStyle(
                fontSize: isMobile ? 24 : 34,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
                fontFamily: 'Outfit',
                height: 1.25,
              ),
            ),
            const SizedBox(height: 16),

            Wrap(
              spacing: 12,
              runSpacing: 10,
              children: [
                Chip(
                  label: Text(_project!['category'].toString().toUpperCase()),
                  backgroundColor: AppTheme.primaryColor.withValues(alpha: 0.08),
                  labelStyle: const TextStyle(color: AppTheme.primaryColor, fontWeight: FontWeight.bold, fontSize: 11),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                Chip(
                  label: Text(_project!['status'].toString().toUpperCase()),
                  backgroundColor: statusColor.withValues(alpha: 0.12),
                  labelStyle: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                if (_project!['location'] != null)
                  Chip(
                    avatar: const Icon(Icons.location_on, size: 14, color: AppTheme.textSecondary),
                    label: Text(_project!['location']),
                    backgroundColor: Colors.grey[100],
                    labelStyle: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
              ],
            ),
            const SizedBox(height: 28),

            // Main Image Carousel Banner
            Container(
              height: isMobile ? 240 : 420,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: images.isNotEmpty
                  ? Stack(
                      children: [
                        PageView.builder(
                          controller: _pageController,
                          onPageChanged: (index) {
                            setState(() => _currentCarouselIndex = index);
                          },
                          itemCount: images.length,
                          itemBuilder: (context, index) {
                            return Image.network(
                              images[index],
                              fit: BoxFit.cover,
                              width: double.infinity,
                              errorBuilder: (_, __, ___) => Image.network(defaultImage, fit: BoxFit.cover),
                            );
                          },
                        ),
                        if (images.length > 1)
                          Positioned(
                            bottom: 16,
                            left: 0,
                            right: 0,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(
                                images.length,
                                (i) => Container(
                                  width: _currentCarouselIndex == i ? 24 : 8,
                                  height: 8,
                                  margin: const EdgeInsets.symmetric(horizontal: 4),
                                  decoration: BoxDecoration(
                                    color: _currentCarouselIndex == i ? AppTheme.secondaryColor : Colors.white.withValues(alpha: 0.6),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    )
                  : Image.network(defaultImage, fit: BoxFit.cover, width: double.infinity),
            ),
            const SizedBox(height: 36),

            // Metadata Info Grid Cards
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Wrap(
                spacing: 32,
                runSpacing: 20,
                children: [
                  if (_project!['area_of_operation'] != null)
                    _buildMetaItem('Area of Operation', _project!['area_of_operation'], Icons.map),
                  if (_project!['target_beneficiaries'] != null)
                    _buildMetaItem('Target Beneficiaries', _project!['target_beneficiaries'], Icons.groups),
                  if (_project!['project_manager_id'] is Map)
                    _buildMetaItem('Project Manager', _project!['project_manager_id']['name'] ?? 'Assigned Manager', Icons.person),
                ],
              ),
            ),
            const SizedBox(height: 36),

            // Description Body Section
            const Text(
              'About the Initiative',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
                fontFamily: 'Outfit',
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _project!['description'] ?? '',
              style: const TextStyle(
                fontSize: 16,
                color: AppTheme.textPrimary,
                height: 1.7,
              ),
            ),
            const SizedBox(height: 48),

            // Share & Support Call-to-Action Bar
            Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                gradient: AppTheme.navyGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const Text(
                    'Partner With Us to Expand This Project',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Outfit',
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Your contribution or sharing this project with your network enables us to reach more lives.',
                    style: TextStyle(color: Colors.grey[300], fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 16,
                    runSpacing: 12,
                    alignment: WrapAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => context.go('/donate'),
                        icon: const Icon(Icons.favorite),
                        label: const Text('Donate to Project'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.secondaryColor,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: _shareProjectLink,
                        icon: const Icon(Icons.share, color: Colors.white),
                        label: const Text('Share Project Link', style: TextStyle(color: Colors.white)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetaItem(String label, String value, IconData icon) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.primaryColor.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: AppTheme.primaryColor, size: 20),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12, fontWeight: FontWeight.w500)),
            const SizedBox(height: 2),
            Text(value, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
      ],
    );
  }
}
