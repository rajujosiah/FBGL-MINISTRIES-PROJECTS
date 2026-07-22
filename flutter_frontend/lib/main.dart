import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

import 'theme.dart';
import 'providers/auth_provider.dart';
import 'widgets/header_footer.dart';
import 'pages/home_page.dart';
import 'pages/team_page.dart';
import 'pages/projects_page.dart';
import 'pages/project_detail_page.dart';
import 'pages/blog_page.dart';
import 'pages/blog_detail_page.dart';
import 'pages/contact_page.dart';
import 'pages/donate_page.dart';
import 'pages/login_page.dart';
import 'pages/dashboard/admin_dashboard.dart';
import 'pages/dashboard/area_manager_dashboard.dart';

import 'pages/dashboard/project_manager_dashboard.dart';
import 'pages/dashboard/project_manager_detail.dart';
import 'pages/dashboard/social_worker_dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Enable clean URLs (remove '#' hash symbol in Web routes)
  usePathUrlStrategy();

  runApp(const MyApp());
}


class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = GoRouter(
      initialLocation: '/',
      redirect: (BuildContext context, GoRouterState state) {
        final auth = Provider.of<AuthProvider>(context, listen: false);
        final loggingIn = state.matchedLocation == '/login';
        final isDashboard = state.matchedLocation.startsWith('/dashboard');

        if (!auth.isAuthenticated && isDashboard) {
          return '/login';
        }

        if (auth.isAuthenticated && loggingIn) {
          final String role = auth.role ?? 'social_worker';
          return '/dashboard/${role.replaceAll('_', '-')}';
        }

        // Handle generic dashboard redirect
        if (state.matchedLocation == '/dashboard' && auth.isAuthenticated) {
          final String role = auth.role ?? 'social_worker';
          return '/dashboard/${role.replaceAll('_', '-')}';
        }

        return null;
      },
      routes: [
        RouteBaseBuilder.build('/', const HomePage()),
        RouteBaseBuilder.build('/team', const TeamPage()),
        RouteBaseBuilder.build('/team/:type/:id', const TeamPage()),
        RouteBaseBuilder.build('/projects', const ProjectsPage()),
        RouteBaseBuilder.build('/projects/:id', const ProjectDetailPage()),
        RouteBaseBuilder.build('/blog', const BlogPage()),
        RouteBaseBuilder.build('/blog/:id', const BlogDetailPage()),
        RouteBaseBuilder.build('/contact', const ContactPage()),
        RouteBaseBuilder.build('/donate', const DonatePage()),
        RouteBaseBuilder.build('/login', const LoginPage()),
        
        // Dashboards
        RouteBaseBuilder.build('/dashboard/admin', const AdminDashboard()),
        RouteBaseBuilder.build('/dashboard/area-manager', const AreaManagerDashboard()),
        RouteBaseBuilder.build('/dashboard/project-manager', const ProjectManagerDashboard()),
        RouteBaseBuilder.build('/dashboard/project-manager/:id', const ProjectManagerDetail()),
        RouteBaseBuilder.build('/dashboard/social-worker', const SocialWorkerDashboard()),
      ],
      errorBuilder: (context, state) => Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('404: Page not found at ${state.matchedLocation}'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: const Text('Back to Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp.router(
        title: 'FIRST BORN GOSPEL LIFE MINISTRIES',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        routerConfig: _router,
      ),
    );
  }
}

// Helper class to clean up Route code structure
class RouteBaseBuilder {
  static GoRoute build(String path, Widget page) {
    return GoRoute(
      path: path,
      pageBuilder: (context, state) {
        // We inject the parameters so pages can access path parameters (e.g. /projects/:id)
        return NoTransitionPage(
          child: PageShell(
            page: page,
            state: state,
          ),
        );
      },
    );
  }
}

// Wrapper to attach the header/footer automatically to all main public pages and reset scroll to top
class PageShell extends StatefulWidget {
  final Widget page;
  final GoRouterState state;

  const PageShell({super.key, required this.page, required this.state});

  @override
  State<PageShell> createState() => _PageShellState();
}

class _PageShellState extends State<PageShell> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollToTop();
  }

  @override
  void didUpdateWidget(covariant PageShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.state.matchedLocation != widget.state.matchedLocation ||
        oldWidget.page != widget.page) {
      _scrollToTop();
    }
  }

  void _scrollToTop() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.jumpTo(0.0);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isDashboard = widget.state.matchedLocation.startsWith('/dashboard');

    if (isDashboard) {
      return widget.page;
    }

    return Scaffold(
      appBar: const CustomHeader(),
      endDrawer: const MobileDrawer(),
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Column(
          children: [
            widget.page,
            const CustomFooter(),
          ],
        ),
      ),
    );
  }
}

