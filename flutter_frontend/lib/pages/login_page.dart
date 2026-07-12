import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscureText = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (success && mounted) {
      // Redirect to dashboard is handled automatically by GoRouter redirect
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final bool isMobile = ResponsiveLayout.isMobile(context);

    return Container(
      color: AppTheme.backgroundColor,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      alignment: Alignment.center,
      child: Container(
        width: 420,
        padding: const EdgeInsets.all(32),
        decoration: AppTheme.glassCardDecoration(color: Colors.white, opacity: 1.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Logo
              const Icon(Icons.lock_outline, size: 48, color: AppTheme.secondaryColor),
              const SizedBox(height: 16),
              const Text(
                'Staff Portal Login',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Access your role dashboard and assignments',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              // Error display
              if (auth.error != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(
                    color: AppTheme.errorColor.withOpacity(0.1),
                    border: Border.all(color: AppTheme.errorColor),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.error_outline, color: AppTheme.errorColor, size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          auth.error!,
                          style: TextStyle(color: AppTheme.errorColor, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),

              // Email Field
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Email Address or Username *',
                  style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textPrimary, fontSize: 13),
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  hintText: 'admin@fbgl.org',
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (val) => (val == null || val.isEmpty) ? 'Please enter your email or username' : null,
              ),
              const SizedBox(height: 24),

              // Password Field
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Password *',
                  style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textPrimary, fontSize: 13),
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _passwordController,
                obscureText: _obscureText,
                decoration: InputDecoration(
                  hintText: '••••••••',
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureText ? Icons.visibility : Icons.visibility_off),
                    onPressed: () => setState(() => _obscureText = !_obscureText),
                  ),
                ),
                validator: (val) => (val == null || val.isEmpty) ? 'Please enter your password' : null,
              ),
              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: auth.isLoading ? null : _handleLogin,
                  child: auth.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('Login securely'),
                ),
              ),
              const SizedBox(height: 24),
              
              // Dev Quick-Fill Buttons
              Wrap(
                spacing: 8,
                runSpacing: 8,
                alignment: WrapAlignment.center,
                children: [
                  ActionChip(
                    label: const Text('Admin', style: TextStyle(fontSize: 10)),
                    onPressed: () {
                      _emailController.text = 'admin@fbgl.org';
                      _passwordController.text = 'asdf1234';
                    },
                  ),
                  ActionChip(
                    label: const Text('Area Mgr', style: TextStyle(fontSize: 10)),
                    onPressed: () {
                      _emailController.text = 'area_manager@fbgl.org';
                      _passwordController.text = 'asdf1234';
                    },
                  ),
                  ActionChip(
                    label: const Text('Project Mgr', style: TextStyle(fontSize: 10)),
                    onPressed: () {
                      _emailController.text = 'project_manager@fbgl.org';
                      _passwordController.text = 'asdf1234';
                    },
                  ),
                  ActionChip(
                    label: const Text('Social Wrk', style: TextStyle(fontSize: 10)),
                    onPressed: () {
                      _emailController.text = 'social_worker@fbgl.org';
                      _passwordController.text = 'asdf1234';
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Note for users
              Text(
                'Only registered Area Managers, Project Managers, and Social Workers can access this portal. If you need credentials, contact the Ministry Admin.',
                style: TextStyle(color: Colors.grey[500], fontSize: 10, height: 1.4),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
