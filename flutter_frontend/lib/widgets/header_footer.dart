import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class CustomHeader extends StatelessWidget implements PreferredSizeWidget {
  const CustomHeader({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(74);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final bool isMobile = ResponsiveLayout.isMobile(context);
    final String currentPath = GoRouterState.of(context).matchedLocation;

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.primaryColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : 32,
        vertical: 10,
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Logo / Branding
            InkWell(
              onTap: () => context.go('/'),
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.secondaryColor.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.church,
                        color: AppTheme.secondaryColor,
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'FBGL MINISTRIES',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            fontFamily: 'Outfit',
                            letterSpacing: 0.8,
                          ),

                        ),
                        Text(
                          'REG. 17/2016',
                          style: TextStyle(
                            color: AppTheme.secondaryColor.withValues(alpha: 0.9),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const Spacer(),

            // Desktop Navigation Links
            if (!isMobile) ...[
              _buildNavLink(context, 'Home', '/', currentPath == '/'),
              _buildNavLink(context, 'Team', '/team', currentPath.startsWith('/team')),
              _buildNavLink(context, 'Projects', '/projects', currentPath.startsWith('/projects')),
              _buildNavLink(context, 'News', '/blog', currentPath.startsWith('/blog')),
              _buildNavLink(context, 'Contact', '/contact', currentPath == '/contact'),
              const SizedBox(width: 12),

              // Action Buttons
              if (authProvider.isAuthenticated)
                ElevatedButton.icon(
                  onPressed: () => context.go('/dashboard'),
                  icon: const Icon(Icons.dashboard, size: 16),
                  label: const Text('Dashboard'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  ),
                )
              else ...[
                OutlinedButton(
                  onPressed: () => context.go('/login'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white70),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                  child: const Text('Staff Login'),
                ),
                const SizedBox(width: 10),
                ElevatedButton.icon(
                  onPressed: () => context.go('/donate'),
                  icon: const Icon(Icons.favorite, size: 16),
                  label: const Text('Donate'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  ),
                ),
              ],
            ] else ...[
              // Mobile Hamburger Icon
              Builder(
                builder: (context) => IconButton(
                  icon: const Icon(Icons.menu, color: Colors.white, size: 28),
                  onPressed: () {
                    Scaffold.of(context).openEndDrawer();
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNavLink(BuildContext context, String label, String route, bool isActive) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: InkWell(
        onTap: () => context.go(route),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            border: isActive
                ? const Border(bottom: BorderSide(color: AppTheme.secondaryColor, width: 2.5))
                : null,
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? AppTheme.secondaryColor : Colors.white70,
              fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}

class MobileDrawer extends StatelessWidget {
  const MobileDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final String currentPath = GoRouterState.of(context).matchedLocation;

    return Drawer(
      backgroundColor: AppTheme.primaryColor,
      child: SafeArea(
        child: Column(
          children: [
            // Drawer Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.white.withValues(alpha: 0.1))),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.secondaryColor.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.church, color: AppTheme.secondaryColor, size: 28),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'FBGL MINISTRIES',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Outfit',
                          ),
                        ),
                        Text(
                          'Reg. 17/2016',
                          style: TextStyle(color: AppTheme.secondaryColor, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Navigation Items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 16),
                children: [
                  _buildDrawerItem(context, Icons.home, 'Home', '/', currentPath == '/'),
                  _buildDrawerItem(context, Icons.groups, 'Our Team Hierarchy', '/team', currentPath.startsWith('/team')),
                  _buildDrawerItem(context, Icons.explore, 'Ministries Projects', '/projects', currentPath.startsWith('/projects')),
                  _buildDrawerItem(context, Icons.newspaper, 'News & Updates', '/blog', currentPath.startsWith('/blog')),
                  _buildDrawerItem(context, Icons.mail_outline, 'Contact Us', '/contact', currentPath == '/contact'),
                  _buildDrawerItem(context, Icons.favorite, 'Donate & Support', '/donate', currentPath == '/donate'),
                  const Divider(color: Colors.white12, height: 32),
                  if (authProvider.isAuthenticated)
                    _buildDrawerItem(context, Icons.dashboard, 'Staff Dashboard', '/dashboard', currentPath.startsWith('/dashboard'))
                  else
                    _buildDrawerItem(context, Icons.login, 'Staff Portal Login', '/login', currentPath == '/login'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem(BuildContext context, IconData icon, String label, String route, bool isActive) {
    return ListTile(
      leading: Icon(icon, color: isActive ? AppTheme.secondaryColor : Colors.white70),
      title: Text(
        label,
        style: TextStyle(
          color: isActive ? AppTheme.secondaryColor : Colors.white,
          fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
          fontSize: 15,
        ),
      ),
      selected: isActive,
      selectedTileColor: AppTheme.secondaryColor.withValues(alpha: 0.15),
      onTap: () {
        Navigator.pop(context);
        context.go(route);
      },
    );
  }
}

class CustomFooter extends StatelessWidget {
  const CustomFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);

    return Container(
      color: const Color(0xFF090D16), // Darker Navy
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: 48,
      ),
      child: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: Column(
            children: [
              Wrap(
                spacing: 48,
                runSpacing: 32,
                alignment: WrapAlignment.spaceBetween,
                children: [
                  // About Column
                  SizedBox(
                    width: isMobile ? double.infinity : 320,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.church, color: AppTheme.secondaryColor, size: 24),
                            SizedBox(width: 10),
                            Text(
                              'FBGL MINISTRIES',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Outfit',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Text(
                          'FIRST BORN GOSPEL LIFE MINISTRIES (Reg. 17/2016) is a non-profit organization dedicated to transforming lives through social, economic, and educational empowerment in Christ.',
                          style: TextStyle(color: Colors.grey[400], fontSize: 13, height: 1.6),
                        ),
                      ],
                    ),
                  ),

                  // Quick Links Column
                  SizedBox(
                    width: isMobile ? double.infinity : 200,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Quick Navigation',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 14),
                        _buildFooterLink(context, 'Home Page', '/'),
                        _buildFooterLink(context, 'Our Leadership Team', '/team'),
                        _buildFooterLink(context, 'Community Projects', '/projects'),
                        _buildFooterLink(context, 'News & Articles', '/blog'),
                        _buildFooterLink(context, 'Donate & Partner', '/donate'),
                      ],
                    ),
                  ),

                  // Contact Column
                  SizedBox(
                    width: isMobile ? double.infinity : 300,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Contact Info',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 14),
                        _buildContactRow(Icons.location_on, 'East Godavari District, Andhra Pradesh, India'),
                        _buildContactRow(Icons.phone, '+91-9876543210'),
                        _buildContactRow(Icons.email, 'contact@fbglministry.org'),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 40),
              const Divider(color: Colors.white12),
              const SizedBox(height: 20),

              // Copyright
              Text(
                '© ${DateTime.now().year} FIRST BORN GOSPEL LIFE MINISTRIES (Reg. 17/2016). All Rights Reserved.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFooterLink(BuildContext context, String label, String route) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => context.go(route),
        child: Text(
          label,
          style: TextStyle(color: Colors.grey[400], fontSize: 13),
        ),
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppTheme.secondaryColor, size: 16),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(color: Colors.grey[400], fontSize: 13, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
