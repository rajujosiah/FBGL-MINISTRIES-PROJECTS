import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:universal_html/html.dart' as html;
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ApiService _apiService = ApiService();
  List<dynamic> _latestBlogs = [];
  List<dynamic> _featuredProjects = [];
  bool _loadingData = true;

  @override
  void initState() {
    super.initState();
    _loadHomeData();
  }

  Future<void> _loadHomeData() async {
    try {
      final blogRes = await _apiService.get('/blog');
      final projRes = await _apiService.get('/projects?showOnHome=true');

      if (mounted) {
        setState(() {
          if (blogRes is List) {
            _latestBlogs = blogRes.take(3).toList();
          }
          if (projRes is List) {
            _featuredProjects = projRes.take(3).toList();
          }
          _loadingData = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _loadingData = false);
      }
    }
  }

  void _shareUrl(BuildContext context, String path, String title) {
    try {
      final String origin = html.window.location.origin;
      final String shareUrl = '$origin$path';
      html.window.navigator.clipboard?.writeText(shareUrl);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.white, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Link copied for "$title"!',
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

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);
    final size = MediaQuery.of(context).size;


    return Column(
      children: [
        // 1. HERO BANNER SECTION
        Container(
          width: double.infinity,
          height: isMobile ? size.height * 0.8 : size.height * 0.72,
          constraints: const BoxConstraints(minHeight: 500, maxHeight: 700),
          child: Stack(
            children: [
              // Hero Background Image
              Positioned.fill(
                child: Image.network(
                  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470',
                  fit: BoxFit.cover,
                ),
              ),
              // Dark Gradient Overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primaryColor.withValues(alpha: 0.92),
                        AppTheme.primaryColor.withValues(alpha: 0.75),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
              ),
              // Content Container
              Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 950),
                  padding: EdgeInsets.symmetric(horizontal: isMobile ? 20 : 32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Sub-badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: AppTheme.secondaryColor.withValues(alpha: 0.5)),
                        ),
                        child: const Text(
                          'REG. NO: 17/2016 • EAST GODAVARI, AP',
                          style: TextStyle(
                            color: AppTheme.accentColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Main Title
                      Text(
                        'FIRST BORN GOSPEL LIFE MINISTRIES',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: isMobile ? 30 : 52,
                          fontWeight: FontWeight.w800,
                          fontFamily: 'Outfit',
                          letterSpacing: -0.5,
                          height: 1.15,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Tagline
                      Text(
                        'Transforming Lives through Social, Economic & Educational Empowerment in Christ',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.grey[200],
                          fontSize: isMobile ? 15 : 20,
                          height: 1.45,
                        ),
                      ),
                      const SizedBox(height: 36),

                      // Action Buttons
                      Wrap(
                        spacing: 16,
                        runSpacing: 14,
                        alignment: WrapAlignment.center,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () => context.go('/projects'),
                            icon: const Icon(Icons.explore, size: 18),
                            label: const Text('Explore Projects'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.secondaryColor,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            ),
                          ),
                          OutlinedButton.icon(
                            onPressed: () => context.go('/team'),
                            icon: const Icon(Icons.groups, color: Colors.white, size: 18),
                            label: const Text('Our Team Hierarchy', style: TextStyle(color: Colors.white)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Colors.white, width: 1.5),
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            ),
                          ),
                          ElevatedButton.icon(
                            onPressed: () => context.go('/donate'),
                            icon: const Icon(Icons.favorite, size: 18),
                            label: const Text('Support Us'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppTheme.primaryColor,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // 2. IMPACT STATS BAR
        Container(
          width: double.infinity,
          color: AppTheme.primaryColor,
          padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 24),
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1100),
              child: Wrap(
                spacing: 32,
                runSpacing: 24,
                alignment: WrapAlignment.spaceAround,
                children: [
                  _buildStatItem('58+', 'Team Members', Icons.badge),
                  _buildStatItem('17', 'Mandals Covered', Icons.map),
                  _buildStatItem('1,000+', 'Families Impacted', Icons.people),
                  _buildStatItem('100%', 'Community Focused', Icons.favorite),
                ],
              ),
            ),
          ),
        ),

        // 3. WELCOME & ABOUT SECTION
        Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 20 : 32,
            vertical: isMobile ? 48 : 64,
          ),
          color: Colors.white,
          width: double.infinity,
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 950),
              child: Column(
                children: [
                  const Text(
                    'Welcome to FBGL Ministries',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                      fontFamily: 'Outfit',
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  Container(width: 70, height: 4, decoration: BoxDecoration(color: AppTheme.secondaryColor, borderRadius: BorderRadius.circular(2))),
                  const SizedBox(height: 28),
                  Text(
                    'FIRST BORN GOSPEL LIFE MINISTRIES is a registered faith-based non-profit organization serving communities across East Godavari district, Andhra Pradesh. We are dedicated to creating lasting social change, economic opportunities, and educational access inspired by the Gospel of Christ.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: isMobile ? 15 : 17,
                      color: AppTheme.textPrimary.withValues(alpha: 0.85),
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // 4. VISION, MISSION, PURPOSE CARDS
        Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 16 : 24,
            vertical: 56,
          ),
          color: AppTheme.backgroundColor,
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1150),
              child: Wrap(
                spacing: 24,
                runSpacing: 24,
                alignment: WrapAlignment.center,
                children: [
                  _buildVMCard(
                    title: 'Vision',
                    description: 'To be a beacon of hope and transformation, uplifting families and villages in Christ through holistic development.',
                    icon: Icons.visibility,
                  ),
                  _buildVMCard(
                    title: 'Mission',
                    description: 'To empower rural communities with clean water, vocational education, and emergency aid to ensure long-term self-reliance.',
                    icon: Icons.rocket_launch,
                  ),
                  _buildVMCard(
                    title: 'Purpose',
                    description: 'To serve the underprivileged with dignity, transparency, and grassroots dedication through our structured Mandal network.',
                    icon: Icons.volunteer_activism,
                  ),
                ],
              ),
            ),
          ),
        ),

        // 5. KEY FOCUS AREAS
        Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 16 : 24,
            vertical: 64,
          ),
          color: Colors.white,
          width: double.infinity,
          child: Column(
            children: [
              const Text(
                'Our Key Focus Areas',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Targeted initiatives addressing core community needs',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
              ),
              const SizedBox(height: 48),
              Container(
                constraints: const BoxConstraints(maxWidth: 1150),
                child: Wrap(
                  spacing: 24,
                  runSpacing: 24,
                  alignment: WrapAlignment.center,
                  children: [
                    _buildFocusCard(
                      context: context,
                      title: 'Social Welfare & Health',
                      description: 'Community health camps, clean water borewell installations, and food distribution for rural villages.',
                      icon: Icons.medical_services_outlined,
                      category: 'social',
                    ),
                    _buildFocusCard(
                      context: context,
                      title: 'Economic Empowerment',
                      description: 'Vocational tailoring training, micro-grant support, and financial literacy programs empowering single mothers.',
                      icon: Icons.work_outline,
                      category: 'economy',
                    ),
                    _buildFocusCard(
                      context: context,
                      title: 'Educational Support',
                      description: 'Digital skill training, school supplies, and evening tutoring centers for underprivileged rural youth.',
                      icon: Icons.school_outlined,
                      category: 'education',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // 6. FEATURED PROJECTS PREVIEW GRID
        if (_featuredProjects.isNotEmpty)
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 16 : 24,
              vertical: 64,
            ),
            color: AppTheme.backgroundColor,
            width: double.infinity,
            child: Column(
              children: [
                const Text(
                  'Featured Community Projects',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontFamily: 'Outfit',
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Explore our active ongoing initiatives in East Godavari',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
                ),
                const SizedBox(height: 40),
                Container(
                  constraints: const BoxConstraints(maxWidth: 1150),
                  child: Wrap(
                    spacing: 24,
                    runSpacing: 24,
                    alignment: WrapAlignment.center,
                    children: _featuredProjects.map((project) {
                      return _buildProjectPreviewCard(context, project);
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 36),
                ElevatedButton.icon(
                  onPressed: () => context.go('/projects'),
                  icon: const Icon(Icons.arrow_forward),
                  label: const Text('View All Projects'),
                ),
              ],
            ),
          ),

        // 7. LATEST BLOG & NEWS
        if (_latestBlogs.isNotEmpty)
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isMobile ? 16 : 24,
              vertical: 64,
            ),
            color: Colors.white,
            width: double.infinity,
            child: Column(
              children: [
                const Text(
                  'Latest Ministry News',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontFamily: 'Outfit',
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Updates, field stories, and progress reports from the ground',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
                ),
                const SizedBox(height: 40),
                Container(
                  constraints: const BoxConstraints(maxWidth: 1150),
                  child: Wrap(
                    spacing: 24,
                    runSpacing: 24,
                    alignment: WrapAlignment.center,
                    children: _latestBlogs.map((post) {
                      return _buildBlogPreviewCard(context, post);
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 36),
                OutlinedButton.icon(
                  onPressed: () => context.go('/blog'),
                  icon: const Icon(Icons.newspaper),
                  label: const Text('View All News Articles'),
                ),
              ],
            ),
          ),

        // 8. CALL TO ACTION BANNER
        Container(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 20 : 32,
            vertical: 64,
          ),
          decoration: const BoxDecoration(
            gradient: AppTheme.navyGradient,
          ),
          width: double.infinity,
          child: Column(
            children: [
              const Text(
                'Make a Lasting Impact Today',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 700),
                child: Text(
                  'Your partnership enables us to provide clean water, educate children, and empower families across rural Mandals.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey[300], fontSize: 15, height: 1.5),
                ),
              ),
              const SizedBox(height: 32),
              Wrap(
                spacing: 16,
                runSpacing: 12,
                alignment: WrapAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => context.go('/donate'),
                    icon: const Icon(Icons.favorite),
                    label: const Text('Donate Now'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondaryColor,
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () => context.go('/contact'),
                    icon: const Icon(Icons.mail_outline, color: Colors.white),
                    label: const Text('Contact Us', style: TextStyle(color: Colors.white)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.white),
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String number, String label, IconData icon) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.secondaryColor.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppTheme.secondaryColor, size: 24),
        ),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              number,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w800,
                fontFamily: 'Outfit',
              ),
            ),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildVMCard({required String title, required String description, required IconData icon}) {
    return Container(
      width: 340,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: AppTheme.secondaryColor.withValues(alpha: 0.12),
            radius: 28,
            child: Icon(icon, color: AppTheme.secondaryColor, size: 26),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 12),
          Text(
            description,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFocusCard({
    required BuildContext context,
    required String title,
    required String description,
    required IconData icon,
    required String category,
  }) {
    return Container(
      width: 340,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppTheme.backgroundColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white, size: 26),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () => context.go('/projects?category=$category'),
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              foregroundColor: AppTheme.secondaryColor,
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('View Projects', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                SizedBox(width: 6),
                Icon(Icons.arrow_forward, size: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectPreviewCard(BuildContext context, Map<String, dynamic> project) {
    final String image = (project['images'] is List && (project['images'] as List).isNotEmpty)
        ? (project['images'] as List)[0]
        : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1024';
    final String projectId = project['_id'] ?? '';
    final String projectTitle = project['title'] ?? 'Project';

    return Container(
      width: 340,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.05),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Image.network(
                image,
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 160,
                  color: AppTheme.primaryColor,
                  alignment: Alignment.center,
                  child: const Icon(Icons.work, color: Colors.white38, size: 40),
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: Material(
                  color: Colors.white.withValues(alpha: 0.9),
                  shape: const CircleBorder(),
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: () => _shareUrl(context, '/projects/$projectId', projectTitle),
                    child: const Padding(
                      padding: EdgeInsets.all(6),
                      child: Icon(Icons.share, size: 16, color: AppTheme.primaryColor),
                    ),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  projectTitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontFamily: 'Outfit',
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  project['description'] ?? '',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 16),
                OutlinedButton(
                  onPressed: () => context.go('/projects/$projectId'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    minimumSize: const Size(double.infinity, 36),
                  ),
                  child: const Text('View Project Details', style: TextStyle(fontSize: 13)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlogPreviewCard(BuildContext context, Map<String, dynamic> post) {
    final String image = (post['cover_image'] != null && post['cover_image'].toString().isNotEmpty)
        ? post['cover_image']
        : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470';
    final String postId = post['_id'] ?? '';
    final String postTitle = post['title'] ?? 'News Article';

    return Container(
      width: 340,
      decoration: BoxDecoration(
        color: AppTheme.backgroundColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(
            image,
            height: 160,
            width: double.infinity,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(
              height: 160,
              color: AppTheme.primaryColor,
              alignment: Alignment.center,
              child: const Icon(Icons.newspaper, color: Colors.white38, size: 40),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  postTitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontFamily: 'Outfit',
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () => context.go('/blog/$postId'),
                      style: TextButton.styleFrom(padding: EdgeInsets.zero),
                      child: const Text('Read Article →', style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold)),
                    ),
                    IconButton(
                      icon: const Icon(Icons.share, size: 16, color: AppTheme.textSecondary),
                      onPressed: () => _shareUrl(context, '/blog/$postId', postTitle),
                      tooltip: 'Share Article',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
