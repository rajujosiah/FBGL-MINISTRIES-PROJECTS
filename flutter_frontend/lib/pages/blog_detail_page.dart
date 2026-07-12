import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:universal_html/html.dart' as html;
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class BlogDetailPage extends StatefulWidget {
  const BlogDetailPage({super.key});

  @override
  State<BlogDetailPage> createState() => _BlogDetailPageState();
}

class _BlogDetailPageState extends State<BlogDetailPage> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _post;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.didChangeDependencies();
    _loadPostDetails();
  }

  Future<void> _loadPostDetails() async {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        final id = GoRouterState.of(context).pathParameters['id'];
        if (id == null) {
          setState(() {
            _error = 'Blog post ID is missing';
            _loading = false;
          });
          return;
        }

        final data = await _apiService.get('/blog/$id');
        setState(() {
          _post = data;
          _loading = false;
        });
      } catch (e) {
        print('Error loading blog: $e');
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

    if (_error != null || _post == null) {
      return SizedBox(
        height: 400,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: AppTheme.errorColor),
              const SizedBox(height: 16),
              Text(_error ?? 'Article not found', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/blog'),
                child: const Text('Back to Blog'),
              ),
            ],
          ),
        ),
      );
    }

    final String image = (_post!['cover_image'] != null && _post!['cover_image'].toString().isNotEmpty)
        ? _post!['cover_image']
        : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470';

    String dateStr = '';
    try {
      final parsedDate = DateTime.parse(_post!['created_at']);
      dateStr = DateFormat('MMMM d, yyyy').format(parsedDate);
    } catch (_) {
      dateStr = _post!['created_at'] ?? '';
    }

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 800),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Back Button
            TextButton.icon(
              onPressed: () => context.go('/blog'),
              icon: const Icon(Icons.arrow_back, color: AppTheme.secondaryColor),
              label: const Text('Back to Blog Listing', style: TextStyle(color: AppTheme.secondaryColor, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),

            // Metadata & Title
            Text(
              '$dateStr • By ${_post!['author_name'] ?? 'Admin'}',
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            Text(
              _post!['title'] ?? '',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor,
                fontFamily: 'Outfit',
                height: 1.2,
              ),
            ),
            const SizedBox(height: 32),

            // Cover Image Banner
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                image,
                height: 400,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox(), // Hide if broken
              ),
            ),
            const SizedBox(height: 32),

            // Main Content Body
            Text(
              _post!['content'] ?? '',
              style: const TextStyle(
                fontSize: 16,
                color: AppTheme.textPrimary,
                height: 1.7,
              ),
            ),
            const SizedBox(height: 48),
            const Divider(),
            const SizedBox(height: 24),

            // Share section or footer note
            Row(
              children: [
                const Text(
                  'Share this update:',
                  style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                ),
                const SizedBox(width: 16),
                IconButton(
                  icon: const Icon(Icons.share, color: AppTheme.secondaryColor),
                  onPressed: () {
                    // Quick web share copy
                    try {
                      html.window.navigator.clipboard?.writeText(html.window.location.href);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Link copied to clipboard!')),
                      );
                    } catch (_) {}
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
