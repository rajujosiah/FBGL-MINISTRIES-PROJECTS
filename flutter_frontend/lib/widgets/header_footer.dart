import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class CustomHeader extends StatelessWidget implements PreferredSizeWidget {
  const CustomHeader({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(70);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final bool isMobile = ResponsiveLayout.isMobile(context);

    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.primaryColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
      child: SafeArea(
        child: Row(
          children: [
            // Logo / Branding
            GestureDetector(
              onTap: () => context.go('/'),
              child: Row(
                children: [
                  const Icon(
                    Icons.church,
                    color: AppTheme.secondaryColor,
                    size: 32,
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'FBGL MINISTRIES',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'Outfit',
                          fontSize: isMobile ? 16 : 20,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const Text(
                        'Registration No: Reg. 17/2016',
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Spacer(),

            // Desktop Navigation Links
            if (!isMobile)
              Row(
                children: [
                  _NavBarLink(title: 'Home', path: '/'),
                  _NavBarLink(title: 'Our Team', path: '/team'),
                  _NavBarLink(title: 'Projects', path: '/projects'),
                  _NavBarLink(title: 'Blog', path: '/blog'),
                  _NavBarLink(title: 'Contact', path: '/contact'),
                  _NavBarLink(title: 'Donate', path: '/donate'),
                  const SizedBox(width: 12),

                  // Login / Dashboard Button
                  if (authProvider.isAuthenticated)
                    ElevatedButton.icon(
                      onPressed: () {
                        final String role = authProvider.role ?? 'social_worker';
                        context.go('/dashboard/${role.replaceAll('_', '-')}');
                      },
                      icon: const Icon(Icons.dashboard_customize, size: 16),
                      label: const Text('Dashboard'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondaryColor,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                    )
                  else
                    OutlinedButton.icon(
                      onPressed: () => context.go('/login'),
                      icon: const Icon(Icons.login, size: 16),
                      label: const Text('Login'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: AppTheme.secondaryColor),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                ],
              )
            else
              // Drawer trigger for mobile
              IconButton(
                icon: const Icon(Icons.menu, color: Colors.white, size: 28),
                onPressed: () {
                  Scaffold.of(context).openEndDrawer();
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _NavBarLink extends StatelessWidget {
  final String title;
  final String path;

  const _NavBarLink({required this.title, required this.path});

  @override
  Widget build(BuildContext context) {
    // Check if the current route matches this path
    final GoRouterState state = GoRouterState.of(context);
    final bool isActive = state.matchedLocation == path;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: TextButton(
        onPressed: () => context.go(path),
        style: TextButton.styleFrom(
          foregroundColor: isActive ? AppTheme.secondaryColor : Colors.white70,
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

// Side Drawer for Mobile/Tablet Screens
class MobileDrawer extends StatelessWidget {
  const MobileDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Drawer(
      backgroundColor: AppTheme.primaryColor,
      child: SafeArea(
        child: Column(
          children: [
            // Drawer Header
            DrawerHeader(
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.white10)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.church,
                    color: AppTheme.secondaryColor,
                    size: 48,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'FIRST BORN GOSPEL LIFE',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'Transforming Communities',
                    style: TextStyle(color: Colors.grey[400], fontSize: 11),
                  ),
                ],
              ),
            ),

            // Links list
            _buildDrawerTile(context, 'Home', '/', Icons.home),
            _buildDrawerTile(context, 'Our Team', '/team', Icons.people),
            _buildDrawerTile(context, 'Projects', '/projects', Icons.work),
            _buildDrawerTile(context, 'Blog', '/blog', Icons.newspaper),
            _buildDrawerTile(context, 'Contact', '/contact', Icons.contact_mail),
            _buildDrawerTile(context, 'Donate', '/donate', Icons.favorite),
            
            const Spacer(),
            const Divider(color: Colors.white10),

            // Auth Button
            if (authProvider.isAuthenticated) ...[
              _buildDrawerTile(
                context,
                'Dashboard',
                '/dashboard/${authProvider.role?.replaceAll('_', '-')}',
                Icons.dashboard_customize,
              ),
              ListTile(
                leading: const Icon(Icons.logout, color: AppTheme.errorColor),
                title: const Text('Logout', style: TextStyle(color: AppTheme.errorColor)),
                onTap: () {
                  Navigator.pop(context);
                  authProvider.logout();
                  context.go('/');
                },
              ),
            ] else
              ListTile(
                leading: const Icon(Icons.login, color: AppTheme.secondaryColor),
                title: const Text('Login', style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/login');
                },
              ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerTile(BuildContext context, String title, String path, IconData icon) {
    final String currentRoute = GoRouterState.of(context).matchedLocation;
    final bool isActive = currentRoute == path;

    return ListTile(
      leading: Icon(icon, color: isActive ? AppTheme.secondaryColor : Colors.white60),
      title: Text(
        title,
        style: TextStyle(
          color: isActive ? AppTheme.secondaryColor : Colors.white,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        context.go(path);
      },
    );
  }
}

// Beautiful Footer Segment
class CustomFooter extends StatelessWidget {
  const CustomFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);

    return Container(
      color: AppTheme.primaryColor,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
      child: Column(
        children: [
          Wrap(
            spacing: 48,
            runSpacing: 32,
            alignment: WrapAlignment.spaceAround,
            children: [
              // Mission Column
              SizedBox(
                width: isMobile ? double.infinity : 300,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.church, color: AppTheme.secondaryColor, size: 28),
                        SizedBox(width: 10),
                        Text(
                          'FBGL MINISTRIES',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Transforming Lives through Social, Economic & Educational Empowerment in Christ.',
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.5),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Registration No: Reg. 17/2016',
                      style: TextStyle(color: Colors.grey[400], fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),

              // Quick Links Column
              SizedBox(
                width: isMobile ? double.infinity : 150,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'QUICK LINKS',
                      style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 16),
                    _buildFooterLink(context, 'Home', '/'),
                    _buildFooterLink(context, 'Our Team', '/team'),
                    _buildFooterLink(context, 'Projects', '/projects'),
                    _buildFooterLink(context, 'Blog Updates', '/blog'),
                  ],
                ),
              ),

              // Support Column
              SizedBox(
                width: isMobile ? double.infinity : 150,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'SUPPORT US',
                      style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 16),
                    _buildFooterLink(context, 'Contact Us', '/contact'),
                    _buildFooterLink(context, 'Donate Now', '/donate'),
                    _buildFooterLink(context, 'Staff Portal', '/login'),
                  ],
                ),
              ),

              // Contact Info Column
              SizedBox(
                width: isMobile ? double.infinity : 250,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'CONTACT DETAILS',
                      style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 16),
                    _buildContactInfoRow(Icons.phone, '+91 7382106748'),
                    _buildContactInfoRow(Icons.email, 'info@fbgl.org'),
                    _buildContactInfoRow(
                      Icons.location_on,
                      'FCRA Cell, State Bank of India, New Delhi Main Branch, 11 Sansad Marg, New Delhi 110 001',
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 48),
          const Divider(color: Colors.white10),
          const SizedBox(height: 24),
          
          // Copyright block
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            spacing: 24,
            runSpacing: 12,
            children: [
              Text(
                '© ${DateTime.now().year} FIRST BORN GOSPEL LIFE MINISTRIES. All rights reserved.',
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
              const Text(
                'Designed & Developed by Kingdom Creative Media',
                style: TextStyle(color: AppTheme.secondaryColor, fontSize: 12, fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFooterLink(BuildContext context, String title, String path) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () => context.go(path),
        child: Text(
          title,
          style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
        ),
      ),
    );
  }

  Widget _buildContactInfoRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppTheme.secondaryColor, size: 16),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
