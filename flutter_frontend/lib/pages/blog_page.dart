import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class BlogPage extends StatefulWidget {
  const BlogPage({super.key});

  @override
  State<BlogPage> createState() => _BlogPageState();
}

class _BlogPageState extends State<BlogPage> {
  final ApiService _apiService = ApiService();
  List<dynamic> _posts = [];
  bool _loading = true;

  @override
  void initState() {
    super.didChangeDependencies();
    _loadBlogPosts();
  }

  Future<void> _loadBlogPosts() async {
    setState(() => _loading = true);
    try {
      final response = await _apiService.get('/blog');
      if (response is List) {
        setState(() {
          _posts = response;
          _loading = false;
        });
      }
    } catch (e) {
      print('Error fetching blogs: $e');
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                'News & Ministry Updates',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Stay informed with the latest stories and reports from our outreach fields',
                style: TextStyle(color: Colors.grey[400], fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),

        // Grid Container
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
          constraints: const BoxConstraints(minHeight: 400),
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : _posts.isEmpty
                  ? const Center(
                      child: Text(
                        'No blog posts published yet.',
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
                            childAspectRatio: 0.78,
                          ),
                          itemCount: _posts.length,
                          itemBuilder: (context, index) {
                            final post = _posts[index];
                            return _buildBlogCard(post);
                          },
                        ),
                      ),
                    ),
        ),
      ],
    );
  }

  Widget _buildBlogCard(Map<String, dynamic> post) {
    final String image = (post['cover_image'] != null && post['cover_image'].toString().isNotEmpty)
        ? post['cover_image']
        : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470';

    String dateStr = '';
    try {
      final parsedDate = DateTime.parse(post['created_at']);
      dateStr = DateFormat('MMMM d, yyyy').format(parsedDate);
    } catch (_) {
      dateStr = post['created_at'] ?? '';
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.go('/blog/${post['_id']}'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover Image
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

            // Content body
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Date & Author
                    Text(
                      '$dateStr • By ${post['author_name'] ?? 'Admin'}',
                      style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 10),

                    // Title
                    Text(
                      post['title'] ?? 'News Update',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryColor,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Content snippet
                    Expanded(
                      child: Text(
                        post['content'] ?? '',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Read More Link
                    Row(
                      children: [
                        Text(
                          'Read More',
                          style: TextStyle(
                            color: AppTheme.secondaryColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.arrow_forward,
                          size: 14,
                          color: AppTheme.secondaryColor,
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
    );
  }
}
