import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class ContactPage extends StatefulWidget {
  const ContactPage({super.key});

  @override
  State<ContactPage> createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();

  bool _isSubmitting = false;
  String? _successMessage;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _successMessage = null;
      _errorMessage = null;
    });

    try {
      final response = await http.post(
        Uri.parse('https://api.web3forms.com/submit'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'access_key': 'a5ae7320-4bf2-4b74-be10-e346fca3b8c2',
          'name': _nameController.text,
          'email': _emailController.text,
          'message': _messageController.text,
        }),
      );

      final data = jsonDecode(response.body);

      if (data['success'] == true) {
        setState(() {
          _successMessage = "Thank you! Your message was submitted successfully.";
          _nameController.clear();
          _emailController.clear();
          _messageController.clear();
        });
      } else {
        setState(() {
          _errorMessage = "Something went wrong. Please try again later.";
        });
      }
    } catch (e) {
      print('Form submission error: $e');
      setState(() {
        _errorMessage = "Connection error. Please check your internet connection.";
      });
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = ResponsiveLayout.isMobile(context);

    return Column(
      children: [
        // Title Banner
        Container(
          width: double.infinity,
          color: AppTheme.primaryColor,
          padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
          child: Column(
            children: [
              const Text(
                'Contact Us',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Outfit',
                ),
              ),
              const SizedBox(height: 12),
              Container(
                constraints: const BoxConstraints(maxWidth: 800),
                child: Text(
                  'FBGL Ministries is dedicated to serving the needy through shelter, food, education, and vocational training. Get in touch with us to join in bringing hope and change to underprivileged communities.',
                  style: TextStyle(color: Colors.grey[400], fontSize: 15, height: 1.4),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),

        // Main Body Form & Contact Info
        Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 1100),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
            child: ResponsiveLayout(
              mobile: Column(
                children: [
                  _buildContactForm(),
                  const SizedBox(height: 48),
                  _buildContactInfo(),
                ],
              ),
              desktop: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _buildContactForm()),
                  const SizedBox(width: 64),
                  Expanded(flex: 2, child: _buildContactInfo()),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContactForm() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Send us a Message',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontFamily: 'Outfit'),
          ),
          const SizedBox(height: 24),

          // Feedback alerts
          if (_successMessage != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: AppTheme.successColor.withOpacity(0.1),
                border: Border.all(color: AppTheme.successColor),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: AppTheme.successColor),
                  const SizedBox(width: 12),
                  Expanded(child: Text(_successMessage!, style: const TextStyle(color: AppTheme.successColor, fontWeight: FontWeight.bold))),
                ],
              ),
            ),

          if (_errorMessage != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: AppTheme.errorColor.withOpacity(0.1),
                border: Border.all(color: AppTheme.errorColor),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(Icons.error, color: AppTheme.errorColor),
                  const SizedBox(width: 12),
                  Expanded(child: Text(_errorMessage!, style: TextStyle(color: AppTheme.errorColor, fontWeight: FontWeight.bold))),
                ],
              ),
            ),

          // Name Input
          const Text('Name *', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 8),
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(hintText: 'Your Name'),
            validator: (val) => (val == null || val.isEmpty) ? 'Please enter your name' : null,
          ),
          const SizedBox(height: 20),

          // Email Input
          const Text('Email *', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 8),
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(hintText: 'your.email@example.com'),
            keyboardType: TextInputType.emailAddress,
            validator: (val) {
              if (val == null || val.isEmpty) return 'Please enter your email';
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(val)) {
                return 'Please enter a valid email address';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),

          // Message Input
          const Text('Message *', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
          const SizedBox(height: 8),
          TextFormField(
            controller: _messageController,
            decoration: const InputDecoration(hintText: 'Your Message'),
            maxLines: 6,
            validator: (val) => (val == null || val.isEmpty) ? 'Please enter a message' : null,
          ),
          const SizedBox(height: 24),

          // Submit Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isSubmitting ? null : _submitForm,
              child: _isSubmitting
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Send Message'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Contact Information',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontFamily: 'Outfit'),
        ),
        const SizedBox(height: 24),
        
        _buildInfoRow(
          icon: Icons.location_on,
          title: 'FCRA Cell Registered Address',
          desc: 'FCRA Cell, 4th Floor, State Bank of India, New Delhi Main Branch, 11 Sansad Marg, New Delhi 110 001',
        ),
        const SizedBox(height: 24),
        _buildInfoRow(
          icon: Icons.phone,
          title: 'Phone Number',
          desc: '+91 7382106748',
        ),
        const SizedBox(height: 24),
        _buildInfoRow(
          icon: Icons.email,
          title: 'Email Address',
          desc: 'info@fbgl.org / vkraju@gmail.com',
        ),
      ],
    );
  }

  Widget _buildInfoRow({required IconData icon, required String title, required String desc}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          backgroundColor: AppTheme.secondaryColor.withOpacity(0.1),
          radius: 20,
          child: Icon(icon, color: AppTheme.secondaryColor, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontSize: 15),
              ),
              const SizedBox(height: 4),
              Text(
                desc,
                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14, height: 1.4),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
