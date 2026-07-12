import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:universal_html/html.dart' as html;
import '../theme.dart';
import '../widgets/responsive_layout.dart';

class DonatePage extends StatelessWidget {
  const DonatePage({super.key});

  void _openPayPal() {
    html.window.open('http://paypal.me/vkraju', '_blank');
  }

  void _copyToClipboard(BuildContext context, String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label copied to clipboard!'),
        backgroundColor: AppTheme.successColor,
        duration: const Duration(seconds: 2),
      ),
    );
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
                'Support Our Mission',
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
                  'Your generous contribution helps us transform lives through Social, Economic & Educational empowerment',
                  style: TextStyle(color: Colors.grey[400], fontSize: 16, height: 1.4),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),

        // Main content
        Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 1100),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
            child: ResponsiveLayout(
              mobile: Column(
                children: [
                  _buildAppealSection(),
                  const SizedBox(height: 48),
                  _buildDonationOptions(context),
                ],
              ),
              desktop: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: _buildAppealSection()),
                  const SizedBox(width: 64),
                  Expanded(flex: 2, child: _buildDonationOptions(context)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAppealSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Make a Difference Today',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontFamily: 'Outfit'),
        ),
        const SizedBox(height: 16),
        const Text(
          'At FIRST BORN GOSPEL LIFE MINISTRIES, we believe in the power of collective action to bring about lasting change. Your donation, no matter how small, can make a significant impact in the lives of those we serve.',
          style: TextStyle(fontSize: 15, color: AppTheme.textPrimary, height: 1.6),
        ),
        const SizedBox(height: 32),

        const Text(
          'How Your Donation is Used',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontFamily: 'Outfit'),
        ),
        const SizedBox(height: 20),

        // Usage grid items
        _buildUsageItem(Icons.school, 'Education Programs', 'Supporting education for underprivileged children through scholarships, school supplies, and tutoring programs.'),
        const SizedBox(height: 16),
        _buildUsageItem(Icons.restaurant, 'Feeding Programs', 'Providing nutritious meals to families and children in need through our community feeding initiatives.'),
        const SizedBox(height: 16),
        _buildUsageItem(Icons.home, 'Community Development', 'Building stronger communities through infrastructure development, health awareness, and social welfare programs.'),
        const SizedBox(height: 16),
        _buildUsageItem(Icons.business_center, 'Economic Empowerment', 'Enabling financial independence through skill development, micro-enterprise support, and vocational training.'),
      ],
    );
  }

  Widget _buildUsageItem(IconData icon, String title, String desc) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppTheme.secondaryColor, size: 24),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.primaryColor)),
              const SizedBox(height: 4),
              Text(desc, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.4)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDonationOptions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Donate Now',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontFamily: 'Outfit'),
        ),
        const SizedBox(height: 24),

        // Quick paypal card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.blue[50]?.withOpacity(0.5),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.blue[100]!),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Quick Donate via PayPal',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blue),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: _openPayPal,
                icon: const Icon(Icons.payment, color: Colors.white),
                label: const Text('Donate via PayPal'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0070BA), // PayPal blue
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Secure payment processing. All donations are tax-deductible.',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // Bank details card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Bank Transfer Details',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primaryColor),
              ),
              const SizedBox(height: 16),
              
              _buildBankDetailField(context, 'Bank Name:', 'Axis Bank'),
              _buildBankDetailField(context, 'Account Name:', 'FIRST BORN GOSPEL LIFE MINISTRIES'),
              _buildBankDetailField(context, 'Account Number:', '926010024775366', canCopy: true),
              _buildBankDetailField(context, 'IFSC Code:', 'UTIB0001962', canCopy: true),
              _buildBankDetailField(context, 'Purpose:', 'Support for Social Work or Education'),
              _buildBankDetailField(context, 'Contact:', '+91 7382106748'),
              
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.08),
                  border: const Border(left: BorderSide(color: AppTheme.secondaryColor, width: 4)),
                  borderRadius: const BorderRadius.only(topRight: Radius.circular(8), bottomRight: Radius.circular(8)),
                ),
                child: const Text(
                  '💡 Please mention the purpose of your donation when making a bank transfer.',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBankDetailField(BuildContext context, String label, String value, {bool canCopy = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textSecondary)),
          const SizedBox(height: 2),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(fontSize: 14, color: AppTheme.textPrimary, fontWeight: FontWeight.w600),
                ),
              ),
              if (canCopy)
                InkWell(
                  onTap: () => _copyToClipboard(context, value, label.replaceAll(':', '')),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    child: Icon(Icons.copy, size: 16, color: AppTheme.secondaryColor),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
