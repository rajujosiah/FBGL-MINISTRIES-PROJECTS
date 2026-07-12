import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../widgets/responsive_layout.dart';

/// Manage Assignments Widget
/// Two sub-tabs:
///   1. Area Manager → Project Manager assignments
///   2. Project Manager → Social Worker assignments
/// With state/district filtering, assign, and unassign capabilities.
class ManageAssignmentsWidget extends StatefulWidget {
  final List<dynamic> allProfiles;
  final VoidCallback onUpdate;

  const ManageAssignmentsWidget({
    super.key,
    required this.allProfiles,
    required this.onUpdate,
  });

  @override
  State<ManageAssignmentsWidget> createState() => _ManageAssignmentsWidgetState();
}

class _ManageAssignmentsWidgetState extends State<ManageAssignmentsWidget> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ApiService _apiService = ApiService();
  final Map<String, String?> _selectedPMForAM = {};
  final Map<String, String?> _selectedSWForPM = {};

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<dynamic> get _areaManagers => widget.allProfiles.where((p) => p['role'] == 'area_manager').toList();
  List<dynamic> get _projectManagers => widget.allProfiles.where((p) => p['role'] == 'project_manager').toList();
  List<dynamic> get _socialWorkers => widget.allProfiles.where((p) => p['role'] == 'social_worker').toList();

  /// Get PMs assigned to a given Area Manager
  List<dynamic> _getPMsForAM(String amId) {
    return _projectManagers.where((pm) {
      final amid = pm['area_manager_id'];
      if (amid == null) return false;
      if (amid is Map) return amid['_id'] == amId;
      return amid.toString() == amId;
    }).toList();
  }

  /// Get unassigned PMs that match AM's state/district
  List<dynamic> _getUnassignedPMsForAM(Map<String, dynamic> am) {
    return _projectManagers.where((pm) {
      final amid = pm['area_manager_id'];
      final isUnassigned = amid == null || 
                           (amid is Map && amid['_id'] == null) || 
                           (amid is String && (amid.trim().isEmpty || amid == 'null'));
      print('PM ${pm['name']}: amid=$amid, type=${amid.runtimeType}, isUnassigned=$isUnassigned');
      return isUnassigned;
    }).toList();
  }

  /// Get SWs assigned to a given Project Manager
  List<dynamic> _getSWsForPM(String pmId) {
    return _socialWorkers.where((sw) {
      final pmid = sw['project_manager_id'];
      if (pmid == null) return false;
      if (pmid is Map) return pmid['_id'] == pmId;
      return pmid.toString() == pmId;
    }).toList();
  }

  /// Get unassigned SWs that match PM's state/district
  List<dynamic> _getUnassignedSWsForPM(Map<String, dynamic> pm) {
    return _socialWorkers.where((sw) {
      final pmid = sw['project_manager_id'];
      final isUnassigned = pmid == null || 
                           (pmid is Map && pmid['_id'] == null) || 
                           (pmid is String && (pmid.trim().isEmpty || pmid == 'null'));
      return isUnassigned;
    }).toList();
  }

  Future<void> _assignPMToAM(String pmId, String amId) async {
    try {
      await _apiService.put('/profiles/$pmId', {'area_manager_id': amId});
      widget.onUpdate();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Assignment failed: $e')));
    }
  }

  Future<void> _unassignPM(String pmId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Unassign'),
        content: const Text('Are you sure you want to unassign this Project Manager from the Area Manager?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Unassign', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _apiService.put('/profiles/$pmId', {'area_manager_id': null});
        widget.onUpdate();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Unassignment failed: $e')));
      }
    }
  }

  Future<void> _assignSWToPM(String swId, String pmId) async {
    try {
      await _apiService.put('/profiles/$swId', {'project_manager_id': pmId});
      widget.onUpdate();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Assignment failed: $e')));
    }
  }

  Future<void> _unassignSW(String swId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Unassign'),
        content: const Text('Are you sure you want to unassign this Social Worker from the Project Manager?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Unassign', style: TextStyle(color: AppTheme.errorColor))),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _apiService.put('/profiles/$swId', {'project_manager_id': null});
        widget.onUpdate();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Unassignment failed: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Manage Assignments', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
        const SizedBox(height: 8),
        const Text('Assign Project Managers to Area Managers and Social Workers to Project Managers based on matching State & District.',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
        const SizedBox(height: 24),

        TabBar(
          controller: _tabController,
          labelColor: AppTheme.secondaryColor,
          unselectedLabelColor: AppTheme.textSecondary,
          indicatorColor: AppTheme.secondaryColor,
          tabs: const [
            Tab(text: 'Area Manager → Project Managers'),
            Tab(text: 'Project Manager → Social Workers'),
          ],
        ),
        const SizedBox(height: 16),

        SizedBox(
          height: 600,
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildAMToPMTab(),
              _buildPMToSWTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAMToPMTab() {
    if (_areaManagers.isEmpty) {
      return const Center(child: Text('No Area Managers found. Create one first.'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 24),
      child: Wrap(
        spacing: 16,
        runSpacing: 16,
        children: _areaManagers.map((dynamic amDyn) {
          final am = amDyn as Map<String, dynamic>;
          final amId = am['_id'].toString();
          final assignedPMs = _getPMsForAM(amId);
          final unassignedPMs = _getUnassignedPMsForAM(am);

          return Container(
            width: ResponsiveLayout.isMobile(context) ? double.infinity : 700,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))
              ]
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(backgroundColor: AppTheme.secondaryColor, child: Icon(Icons.person, color: Colors.white)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(am['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primaryColor)),
                          Text('${am['state'] ?? ''} - ${am['district'] ?? ''}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                ResponsiveLayout.isMobile(context)
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildUnassignedPMsList(unassignedPMs, am),
                        const SizedBox(height: 16),
                        const Divider(),
                        const SizedBox(height: 16),
                        _buildAssignedPMsList(assignedPMs),
                      ],
                    )
                  : IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(child: _buildUnassignedPMsList(unassignedPMs, am)),
                          const SizedBox(width: 16),
                          const VerticalDivider(),
                          const SizedBox(width: 16),
                          Expanded(child: _buildAssignedPMsList(assignedPMs)),
                        ],
                      ),
                    ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPMToSWTab() {
    if (_projectManagers.isEmpty) {
      return const Center(child: Text('No Project Managers found. Create one first.'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 24),
      child: Wrap(
        spacing: 16,
        runSpacing: 16,
        children: _projectManagers.map((dynamic pmDyn) {
          final pm = pmDyn as Map<String, dynamic>;
          final pmId = pm['_id'].toString();
          final assignedSWs = _getSWsForPM(pmId);
          final unassignedSWs = _getUnassignedSWsForPM(pm);

          return Container(
            width: ResponsiveLayout.isMobile(context) ? double.infinity : 700,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))
              ]
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(backgroundColor: Colors.teal, child: Icon(Icons.business_center, color: Colors.white)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(pm['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primaryColor)),
                          Text('${pm['state'] ?? ''} - ${pm['district'] ?? ''}', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                ResponsiveLayout.isMobile(context)
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildUnassignedSWsList(unassignedSWs, pm),
                        const SizedBox(height: 16),
                        const Divider(),
                        const SizedBox(height: 16),
                        _buildAssignedSWsList(assignedSWs),
                      ],
                    )
                  : IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(child: _buildUnassignedSWsList(unassignedSWs, pm)),
                          const SizedBox(width: 16),
                          const VerticalDivider(),
                          const SizedBox(width: 16),
                          Expanded(child: _buildAssignedSWsList(assignedSWs)),
                        ],
                      ),
                    ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAssignedPMsList(List<dynamic> assignedPMs) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Assigned Project Managers:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          if (assignedPMs.isEmpty) const Text('None assigned.', style: TextStyle(color: AppTheme.textSecondary)),
          ...assignedPMs.map((pm) => ListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.person_outline, size: 20),
            title: Text(pm['name'] ?? ''),
            subtitle: Text('ID: ${pm['id_no'] ?? 'N/A'}'),
            trailing: IconButton(
              icon: const Icon(Icons.link_off, color: AppTheme.errorColor, size: 20),
              tooltip: 'Unassign',
              onPressed: () => _unassignPM(pm['_id'].toString()),
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildUnassignedPMsList(List<dynamic> unassignedPMs, Map<String, dynamic> am) {
    final amId = am['_id'].toString();
    final matchingPMs = unassignedPMs.where((pm) => pm['state'] == am['state'] && pm['district'] == am['district']).toList();
    final nonMatchingPMs = unassignedPMs.where((pm) => pm['state'] != am['state'] || pm['district'] != am['district']).toList();
    final sortedPMs = [...matchingPMs, ...nonMatchingPMs];

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Assign a Project Manager:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.deepOrange)),
          const SizedBox(height: 8),
          if (sortedPMs.isEmpty) 
            const Text('No unassigned Project Managers available.', style: TextStyle(color: AppTheme.textSecondary))
          else
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  value: _selectedPMForAM[amId],
                  decoration: const InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(),
                  ),
                  hint: const Text('Select Project Manager'),
                  onChanged: (val) {
                    setState(() {
                      _selectedPMForAM[amId] = val;
                    });
                  },
                  items: sortedPMs.map((pm) {
                    final isMatching = pm['state'] == am['state'] && pm['district'] == am['district'];
                    final pmIdStr = pm['_id'].toString();
                    return DropdownMenuItem<String>(
                      value: pmIdStr,
                      child: Text(
                        '${pm['name']} (${pm['id_no']})${isMatching ? '' : ' - (Diff State/Dist)'}',
                        style: TextStyle(color: isMatching ? Colors.black : Colors.red.shade700, fontSize: 13),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _selectedPMForAM[amId] == null ? null : () {
                    _assignPMToAM(_selectedPMForAM[amId]!, amId);
                    setState(() {
                      _selectedPMForAM[amId] = null;
                    });
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryColor),
                  child: const Text('Assign Selected'),
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildAssignedSWsList(List<dynamic> assignedSWs) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Assigned Social Workers:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          if (assignedSWs.isEmpty) const Text('None assigned.', style: TextStyle(color: AppTheme.textSecondary)),
          ...assignedSWs.map((sw) => ListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.person_outline, size: 20),
            title: Text(sw['name'] ?? ''),
            subtitle: Text('ID: ${sw['id_no'] ?? 'N/A'}'),
            trailing: IconButton(
              icon: const Icon(Icons.link_off, color: AppTheme.errorColor, size: 20),
              tooltip: 'Unassign',
              onPressed: () => _unassignSW(sw['_id'].toString()),
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildUnassignedSWsList(List<dynamic> unassignedSWs, Map<String, dynamic> pm) {
    final pmId = pm['_id'].toString();
    final matchingSWs = unassignedSWs.where((sw) => sw['state'] == pm['state'] && sw['district'] == pm['district']).toList();
    final nonMatchingSWs = unassignedSWs.where((sw) => sw['state'] != pm['state'] || sw['district'] != pm['district']).toList();
    final sortedSWs = [...matchingSWs, ...nonMatchingSWs];

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Assign a Social Worker:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.deepOrange)),
          const SizedBox(height: 8),
          if (sortedSWs.isEmpty) 
            const Text('No unassigned Social Workers available.', style: TextStyle(color: AppTheme.textSecondary))
          else
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  value: _selectedSWForPM[pmId],
                  decoration: const InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(),
                  ),
                  hint: const Text('Select Social Worker'),
                  onChanged: (val) {
                    setState(() {
                      _selectedSWForPM[pmId] = val;
                    });
                  },
                  items: sortedSWs.map((sw) {
                    final isMatching = sw['state'] == pm['state'] && sw['district'] == pm['district'];
                    final swIdStr = sw['_id'].toString();
                    return DropdownMenuItem<String>(
                      value: swIdStr,
                      child: Text(
                        '${sw['name']} (${sw['id_no']})${isMatching ? '' : ' - (Diff State/Dist)'}',
                        style: TextStyle(color: isMatching ? Colors.black : Colors.red.shade700, fontSize: 13),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _selectedSWForPM[pmId] == null ? null : () {
                    _assignSWToPM(_selectedSWForPM[pmId]!, pmId);
                    setState(() {
                      _selectedSWForPM[pmId] = null;
                    });
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryColor),
                  child: const Text('Assign Selected'),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
