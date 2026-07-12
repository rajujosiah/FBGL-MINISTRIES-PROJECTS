import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';

import '../services/api_service.dart';
import '../theme.dart';
import 'id_card_widget.dart';

/// Profile Modal with three tabs: View | Edit | ID Card
/// Used across all dashboards for viewing/editing personal profiles.
class ProfileModal extends StatefulWidget {
  final Map<String, dynamic> user;
  final String role;
  final VoidCallback onClose;
  final VoidCallback? onUpdate;

  const ProfileModal({
    super.key,
    required this.user,
    required this.role,
    required this.onClose,
    this.onUpdate,
  });

  @override
  State<ProfileModal> createState() => _ProfileModalState();
}

class _ProfileModalState extends State<ProfileModal> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ApiService _apiService = ApiService();

  late TextEditingController _name;
  late TextEditingController _email;
  late TextEditingController _phone;
  late TextEditingController _address;
  late TextEditingController _bio;
  late TextEditingController _aadhaar;

  bool _saving = false;
  Uint8List? _selectedImageBytes;
  String? _selectedImageName;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _name = TextEditingController(text: widget.user['name'] ?? '');
    _email = TextEditingController(text: widget.user['email'] ?? '');
    _phone = TextEditingController(text: widget.user['phone'] ?? '');
    _address = TextEditingController(text: widget.user['address'] ?? '');
    _bio = TextEditingController(text: widget.user['bio'] ?? '');
    _aadhaar = TextEditingController(text: widget.user['aadhaar_no'] ?? '');
  }

  @override
  void dispose() {
    _tabController.dispose();
    _name.dispose();
    _email.dispose();
    _phone.dispose();
    _address.dispose();
    _bio.dispose();
    _aadhaar.dispose();
    super.dispose();
  }

  String _getRoleLabel() {
    const roleMap = {
      'admin': 'ADMINISTRATOR',
      'area_manager': 'AREA MANAGER',
      'project_manager': 'PROJECT MANAGER',
      'social_worker': 'SOCIAL WORKER',
      'board_member': 'BOARD MEMBER',
    };
    return roleMap[widget.role] ?? 'MEMBER';
  }

  Future<void> _saveProfile() async {
    setState(() => _saving = true);
    try {
      final profileId = widget.user['_id'] ?? widget.user['id'];
      if (profileId == null) throw Exception('Profile ID not found');

      final body = {
        'name': _name.text,
        'phone': _phone.text,
        'address': _address.text,
        'bio': _bio.text,
        'aadhaar_no': _aadhaar.text,
      };

      if (_selectedImageBytes != null) {
        final uploadResponse = await _apiService.uploadFile(
          '/profiles/$profileId/image',
          _selectedImageBytes!,
          _selectedImageName ?? 'profile.jpg',
          'image/jpeg',
        );
        if (uploadResponse != null && uploadResponse['profile_picture'] != null) {
           body['profile_picture'] = uploadResponse['profile_picture'];
        }
      }

      final response = await _apiService.put('/profiles/$profileId', body);

      if (response != null && response['profile'] != null) {
        setState(() {
          widget.user.addAll(response['profile'] as Map<String, dynamic>);
          _selectedImageBytes = null;
          _selectedImageName = null;
        });
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully!'), backgroundColor: AppTheme.successColor),
      );

      widget.onUpdate?.call();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update profile: $e')),
      );
    } finally {
      setState(() => _saving = false);
    }
  }

  Future<void> _pickProfilePicture() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.image);
    if (result != null && result.files.single.bytes != null) {
      setState(() {
        _selectedImageBytes = result.files.single.bytes;
        _selectedImageName = result.files.single.name;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: const EdgeInsets.all(24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 600, maxHeight: 700),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: const BoxDecoration(
                color: AppTheme.primaryColor,
                borderRadius: BorderRadius.only(topLeft: Radius.circular(16), topRight: Radius.circular(16)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: AppTheme.secondaryColor,
                    backgroundImage: widget.user['profile_picture'] != null && widget.user['profile_picture'].toString().isNotEmpty
                        ? NetworkImage(widget.user['profile_picture'])
                        : null,
                    child: widget.user['profile_picture'] == null ? const Icon(Icons.person, color: Colors.white) : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.user['name'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                        Text(_getRoleLabel(), style: const TextStyle(color: Colors.white70, fontSize: 12)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: widget.onClose,
                  ),
                ],
              ),
            ),

            // Tabs
            Container(
              color: AppTheme.primaryColor.withOpacity(0.9),
              child: TabBar(
                controller: _tabController,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.white60,
                indicatorColor: AppTheme.secondaryColor,
                tabs: const [
                  Tab(text: 'View Profile'),
                  Tab(text: 'Edit Profile'),
                  Tab(text: 'ID Card'),
                ],
              ),
            ),

            // Tab Content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildViewTab(),
                  _buildEditTab(),
                  _buildIDCardTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildViewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Picture
          Center(
            child: Container(
              margin: const EdgeInsets.only(bottom: 24),
              width: 100,
              height: 100,
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
                child: (widget.user['profile_picture'] != null && widget.user['profile_picture'].toString().isNotEmpty)
                    ? Image.network(
                        widget.user['profile_picture'],
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => _buildAvatarFallback(),
                      )
                    : _buildAvatarFallback(),
              ),
            ),
          ),
          _buildInfoRow('Name', widget.user['name']),
          _buildInfoRow('Role', _getRoleLabel()),
          _buildInfoRow('ID Number', widget.user['id_no']),
          _buildInfoRow('Email', widget.user['email']),
          _buildInfoRow('Phone', widget.user['phone']),
          _buildInfoRow('State', widget.user['state']),
          _buildInfoRow('District', widget.user['district']),
          _buildInfoRow('Address', widget.user['address']),
          _buildInfoRow('Aadhaar No', widget.user['aadhaar_no']),
          _buildInfoRow('Bio', widget.user['bio']),
          if (widget.user['area_manager_id'] != null && widget.user['area_manager_id'] is Map)
            _buildInfoRow('Reports to (AM)', widget.user['area_manager_id']['name']),
          if (widget.user['project_manager_id'] != null && widget.user['project_manager_id'] is Map)
            _buildInfoRow('Reports to (PM)', widget.user['project_manager_id']['name']),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, dynamic value) {
    if (value == null || value.toString().isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textSecondary, fontSize: 13)),
          ),
          Expanded(
            child: Text(value.toString(), style: const TextStyle(fontSize: 14)),
          ),
        ],
      ),
    );
  }

  Widget _buildEditTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Picture
          Center(
            child: GestureDetector(
              onTap: _pickProfilePicture,
              child: CircleAvatar(
                radius: 48,
                backgroundColor: AppTheme.secondaryColor,
                backgroundImage: _selectedImageBytes != null
                    ? MemoryImage(_selectedImageBytes!)
                    : (widget.user['profile_picture'] != null && widget.user['profile_picture'].toString().isNotEmpty
                        ? NetworkImage(widget.user['profile_picture']) as ImageProvider
                        : null),
                child: _selectedImageBytes == null && (widget.user['profile_picture'] == null || widget.user['profile_picture'].toString().isEmpty)
                    ? const Icon(Icons.camera_alt, color: Colors.white, size: 32)
                    : null,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              _selectedImageName ?? 'Tap to change photo',
              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            ),
          ),
          const SizedBox(height: 24),

          TextField(controller: _name, decoration: const InputDecoration(labelText: 'Name', border: OutlineInputBorder())),
          const SizedBox(height: 16),
          TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email (read-only)', border: OutlineInputBorder()), readOnly: true),
          const SizedBox(height: 16),
          TextField(controller: _phone, decoration: const InputDecoration(labelText: 'Phone', border: OutlineInputBorder())),
          const SizedBox(height: 16),
          TextField(controller: _address, decoration: const InputDecoration(labelText: 'Address', border: OutlineInputBorder()), maxLines: 2),
          const SizedBox(height: 16),
          TextField(controller: _aadhaar, decoration: const InputDecoration(labelText: 'Aadhaar Number', border: OutlineInputBorder())),
          const SizedBox(height: 16),
          TextField(controller: _bio, decoration: const InputDecoration(labelText: 'Bio', border: OutlineInputBorder()), maxLines: 3),
          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saving ? null : _saveProfile,
              child: _saving ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Save Changes'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIDCardTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: IDCardWidget(
          profile: widget.user,
        ),
      ),
    );
  }

  Widget _buildAvatarFallback() {
    return Container(
      color: Colors.grey[200],
      child: const Icon(
        Icons.person,
        size: 50,
        color: AppTheme.primaryColor,
      ),
    );
  }
}
