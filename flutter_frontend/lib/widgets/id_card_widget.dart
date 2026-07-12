import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:universal_html/html.dart' as html;
import '../theme.dart';

class IDCardWidget extends StatelessWidget {
  final Map<String, dynamic> profile;
  final GlobalKey boundaryKey = GlobalKey();

  IDCardWidget({super.key, required this.profile});

  Future<void> _downloadIDCard(BuildContext context) async {
    try {
      // Find boundary render object
      final RenderRepaintBoundary? boundary =
          boundaryKey.currentContext?.findRenderObject() as RenderRepaintBoundary?;
      
      if (boundary == null) return;

      // Render image with 3.0 pixel ratio for high definition print quality
      final ui.Image image = await boundary.toImage(pixelRatio: 3.0);
      final ByteData? byteData =
          await image.toByteData(format: ui.ImageByteFormat.png);
      
      if (byteData == null) return;

      final Uint8List pngBytes = byteData.buffer.asUint8List();

      // Trigger Web browser download
      final blob = html.Blob([pngBytes], 'image/png');
      final url = html.Url.createObjectUrlFromBlob(blob);
      final anchor = html.AnchorElement(href: url)
        ..setAttribute('download', 'FBGL_ID_Card_${profile['id_no'] ?? profile['name']}.png')
        ..click();
      
      html.Url.revokeObjectUrl(url);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('ID Card PNG image downloaded successfully!'),
          backgroundColor: AppTheme.successColor,
        ),
      );
    } catch (e) {
      print('Error exporting ID card: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download ID Card: $e'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }

  String _formatRole(String? role) {
    if (role == null) return '';
    return role.split('_').map((word) => word[0].toUpperCase() + word.substring(1)).join(' ');
  }

  @override
  Widget build(BuildContext context) {
    final String cardRole = _formatRole(profile['role']);
    
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Card Container wrapped in RepaintBoundary for PNG rendering
        RepaintBoundary(
          key: boundaryKey,
          child: Container(
            width: 320,
            height: 480,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.primaryColor, width: 3),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Top Header block (Navy blue with gold strip)
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 90,
                  child: Container(
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryColor,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(12),
                        topRight: Radius.circular(12),
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'FIRST BORN GOSPEL LIFE MINISTRIES',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Reg. No: Reg. 17/2016',
                          style: TextStyle(
                            color: Colors.amber[400],
                            fontSize: 9,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Gold separator line
                Positioned(
                  top: 90,
                  left: 0,
                  right: 0,
                  height: 6,
                  child: Container(color: AppTheme.secondaryColor),
                ),

                // Card Details Body
                Positioned(
                  top: 105,
                  bottom: 45,
                  left: 16,
                  right: 16,
                  child: Column(
                    children: [
                      // Profile Image
                      Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.secondaryColor, width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: (profile['profile_picture'] != null && profile['profile_picture'].toString().isNotEmpty)
                              ? Image.network(
                                  profile['profile_picture'],
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => _buildAvatarFallback(),
                                )
                              : _buildAvatarFallback(),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Name
                      Text(
                        profile['name'] ?? 'Staff Member',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      
                      // Role/Designation Title
                      Text(
                        cardRole.toUpperCase(),
                        style: const TextStyle(
                          color: AppTheme.secondaryColor,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Details grid
                      _buildInfoRow('ID NO:', profile['id_no'] ?? 'N/A', isBold: true),
                      const SizedBox(height: 6),
                      _buildInfoRow('REGION:', '${profile['district'] ?? 'N/A'}, ${profile['state'] ?? 'N/A'}'),
                      const SizedBox(height: 6),
                      _buildInfoRow('PHONE:', profile['phone'] ?? 'N/A'),
                      const SizedBox(height: 6),
                      _buildInfoRow('AADHAAR:', profile['aadhaar_no'] ?? 'N/A'),
                    ],
                  ),
                ),

                // Card Footer Bar
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 35,
                  child: Container(
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryColor,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(12),
                        bottomRight: Radius.circular(12),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'Transforming Lives In Christ',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        
        // Export Action Button
        ElevatedButton.icon(
          onPressed: () => _downloadIDCard(context),
          icon: const Icon(Icons.download),
          label: const Text('Download ID Card'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.primaryColor,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildAvatarFallback() {
    return Container(
      color: Colors.grey[200],
      child: const Icon(
        Icons.person,
        size: 60,
        color: AppTheme.primaryColor,
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 75,
          child: Text(
            label,
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 11,
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}
