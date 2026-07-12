import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
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
  bool _loadingBlogs = true;

  @override
  void initState() {
    super.initState();
    _loadLatestBlogs();
  }

  Future<void> _loadLatestBlogs() async {
    try {
      final response = await _apiService.get('/blog');
      if (response is List) {
        setState(() {
          // Take top 3 latest
          _latestBlogs = response.take(3).toList();
          _loadingBlogs = false;
        });
      }
    } catch (e) {
      print('Error loading blogs: $e');
      setState(() => _loadingBlogs = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);
    final size = MediaQuery.of(context).size;

    return Column(
      children: [
        // 1. HERO BANNER
        Container(
          width: double.infinity,
          height: size.height * 0.75,
          constraints: const BoxConstraints(minHeight: 450),
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: NetworkImage('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470'),
              fit: BoxFit.cover,
            ),
          ),
          child: Stack(
            children: [
              // Dark navy overlay with opacity
              Container(color: AppTheme.primaryColor.withOpacity(0.75)),
              Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 900),
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'FIRST BORN GOSPEL LIFE MINISTRIES',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: isMobile ? 32 : 54,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Outfit',
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Registration No: Reg. 17/2016',
                        style: TextStyle(
                          color: AppTheme.secondaryColor,
                          fontSize: isMobile ? 14 : 20,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Transforming Lives through Social, Economic & Educational Empowerment in Christ',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.9),
                          fontSize: isMobile ? 16 : 22,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 40),
                      // Buttons
                      Wrap(
                        spacing: 20,
                        runSpacing: 16,
                        alignment: WrapAlignment.center,
                        children: [
                          ElevatedButton(
                            onPressed: () => context.go('/team'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.secondaryColor,
                              foregroundColor: Colors.white,
                            ),
                            child: const Text('Learn More'),
                          ),
                          OutlinedButton(
                            onPressed: () => context.go('/contact'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(color: Colors.white, width: 2),
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('Join Us', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          ElevatedButton(
                            onPressed: () => context.go('/donate'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppTheme.primaryColor,
                            ),
                            child: const Text('Donate Now'),
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

        // 2. WELCOME STATEMENT
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
          color: Colors.white,
          width: double.infinity,
          child: Column(
            children: [
              const Text(
                'Welcome Message',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              Container(width: 80, height: 4, color: AppTheme.secondaryColor),
              const SizedBox(height: 32),
              Container(
                constraints: const BoxConstraints(maxWidth: 800),
                child: Column(
                  children: [
                    Text(
                      'Welcome to FIRST BORN GOSPEL LIFE MINISTRIES, a faith-based non-profit organization dedicated to transforming communities through social development, economic empowerment, and educational support programs inspired by the Gospel of Christ.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppTheme.textPrimary.withOpacity(0.8),
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'We believe in the power of love, compassion, and service to create lasting change in the lives of individuals and communities. Through our programs, we strive to bring hope, opportunity, and transformation to those who need it most.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppTheme.textPrimary.withOpacity(0.8),
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // 3. VISION & MISSION
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
          color: AppTheme.backgroundColor,
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1100),
              child: Wrap(
                spacing: 32,
                runSpacing: 32,
                alignment: WrapAlignment.center,
                children: [
                  _buildVMCard(
                    title: 'Vision',
                    description: 'To be a beacon of hope, transforming lives and communities through the Gospel of Christ.',
                    icon: Icons.visibility,
                  ),
                  _buildVMCard(
                    title: 'Mission',
                    description: 'To empower individuals and communities through social, economic, and educational initiatives that reflect the love of Christ.',
                    icon: Icons.rocket_launch,
                  ),
                  _buildVMCard(
                    title: 'Purpose',
                    description: 'To serve the underserved, uplift the marginalized, and create pathways to sustainable development and empowerment.',
                    icon: Icons.volunteer_activism,
                  ),
                ],
              ),
            ),
          ),
        ),

        // 4. KEY FOCUS AREAS
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
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
              const SizedBox(height: 12),
              Container(width: 80, height: 4, color: AppTheme.secondaryColor),
              const SizedBox(height: 48),
              Container(
                constraints: const BoxConstraints(maxWidth: 1100),
                child: Wrap(
                  spacing: 32,
                  runSpacing: 32,
                  alignment: WrapAlignment.center,
                  children: [
                    _buildFocusCard(
                      context: context,
                      title: 'Social',
                      description: 'Community development, health awareness, and social welfare programs that strengthen families and neighborhoods.',
                      icon: Icons.people_outline,
                      category: 'social',
                    ),
                    _buildFocusCard(
                      context: context,
                      title: 'Economy',
                      description: 'Economic empowerment through skill development, micro-enterprise support, and financial literacy programs.',
                      icon: Icons.currency_rupee_outlined,
                      category: 'economy',
                    ),
                    _buildFocusCard(
                      context: context,
                      title: 'Education',
                      description: 'Educational support, scholarships, tutoring programs, and resources to ensure every child has access to quality education.',
                      icon: Icons.school_outlined,
                      category: 'education',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // 5. BLOG SLIDER
        if (_latestBlogs.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
            color: AppTheme.backgroundColor,
            width: double.infinity,
            child: Column(
              children: [
                const Text(
                  'Latest News & Updates',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontFamily: 'Outfit',
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Stay updated with our latest activities and news',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
                ),
                const SizedBox(height: 48),
                Container(
                  constraints: const BoxConstraints(maxWidth: 1100),
                  child: Wrap(
                    spacing: 32,
                    runSpacing: 32,
                    alignment: WrapAlignment.center,
                    children: _latestBlogs.map((post) {
                      return GestureDetector(
                        onTap: () => context.go('/blog/${post['_id']}'),
                        child: Container(
                          width: 320,
                          decoration: AppTheme.glassCardDecoration(
                            color: Colors.white,
                            opacity: 1.0,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Blog cover image
                              ClipRRect(
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(16),
                                  topRight: Radius.circular(16),
                                ),
                                child: (post['cover_image'] != null && post['cover_image'].toString().isNotEmpty)
                                    ? Image.network(
                                        post['cover_image'],
                                        height: 180,
                                        width: double.infinity,
                                        fit: BoxFit.cover,
                                      )
                                    : Container(
                                        height: 180,
                                        color: AppTheme.primaryColor,
                                        alignment: Alignment.center,
                                        child: const Icon(Icons.newspaper, color: Colors.white54, size: 48),
                                      ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(20),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      post['title'] ?? 'News Update',
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    TextButton(
                                      onPressed: () => context.go('/blog/${post['_id']}'),
                                      style: TextButton.styleFrom(
                                        padding: EdgeInsets.zero,
                                        foregroundColor: AppTheme.secondaryColor,
                                      ),
                                      child: const Text('Read More →', style: TextStyle(fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  onPressed: () => context.go('/blog'),
                  child: const Text('View All Blog Posts'),
                ),
              ],
            ),
          ),

        // 6. CALL TO ACTION
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
          color: AppTheme.primaryColor,
          width: double.infinity,
          child: Column(
            children: [
              const Text(
                'Join Us in Making a Difference',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Your support can transform lives. Become a part of our mission today.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
              ),
              const SizedBox(height: 32),
              Wrap(
                spacing: 20,
                runSpacing: 16,
                alignment: WrapAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () => context.go('/contact'),
                    child: const Text('Get Involved'),
                  ),
                  ElevatedButton(
                    onPressed: () => context.go('/donate'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondaryColor,
                    ),
                    child: const Text('Support Us'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildVMCard({required String title, required String description, required IconData icon}) {
    return Container(
      width: 320,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: AppTheme.secondaryColor.withOpacity(0.1),
            radius: 30,
            child: Icon(icon, color: AppTheme.secondaryColor, size: 28),
          ),
          const SizedBox(height: 24),
          Text(
            title,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 16),
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
      width: 320,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppTheme.backgroundColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppTheme.primaryColor, size: 40),
          const SizedBox(height: 24),
          Text(
            title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 12),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          TextButton(
            onPressed: () => context.go('/projects?category=$category'),
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              foregroundColor: AppTheme.secondaryColor,
            ),
            child: const Text('View Projects →', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
