import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:excel/excel.dart';
import 'dart:typed_data';
import 'package:universal_html/html.dart' as html;

import '../theme.dart';


/// Report configuration for each role/entity type
class ReportConfig {
  final String label;
  final List<ReportField> fields;
  const ReportConfig({required this.label, required this.fields});
}

class ReportField {
  final String key;
  final String label;
  const ReportField({required this.key, required this.label});
}

const Map<String, ReportConfig> reportConfigs = {
  'projects': ReportConfig(label: 'Projects', fields: [
    ReportField(key: 'title', label: 'Project Title'),
    ReportField(key: 'status', label: 'Status'),
    ReportField(key: 'category', label: 'Category'),
    ReportField(key: 'location', label: 'Location'),
    ReportField(key: 'area_of_operation', label: 'Area of Operation'),
    ReportField(key: 'target_beneficiaries', label: 'Target Beneficiaries'),
    ReportField(key: 'description', label: 'Description'),
  ]),
  'area_manager': ReportConfig(label: 'Area Managers', fields: [
    ReportField(key: 'id_no', label: 'ID No'),
    ReportField(key: 'name', label: 'Name'),
    ReportField(key: 'email', label: 'Email'),
    ReportField(key: 'phone', label: 'Phone'),
    ReportField(key: 'state', label: 'State'),
    ReportField(key: 'district', label: 'District'),
  ]),
  'project_manager': ReportConfig(label: 'Project Managers', fields: [
    ReportField(key: 'id_no', label: 'ID No'),
    ReportField(key: 'name', label: 'Name'),
    ReportField(key: 'email', label: 'Email'),
    ReportField(key: 'phone', label: 'Phone'),
    ReportField(key: 'state', label: 'State'),
    ReportField(key: 'district', label: 'District'),
  ]),
  'social_worker': ReportConfig(label: 'Social Workers', fields: [
    ReportField(key: 'id_no', label: 'ID No'),
    ReportField(key: 'name', label: 'Name'),
    ReportField(key: 'email', label: 'Email'),
    ReportField(key: 'phone', label: 'Phone'),
    ReportField(key: 'state', label: 'State'),
    ReportField(key: 'district', label: 'District'),
  ]),
  'admin': ReportConfig(label: 'Admins', fields: [
    ReportField(key: 'name', label: 'Name'),
    ReportField(key: 'email', label: 'Email'),
    ReportField(key: 'role', label: 'Role'),
  ]),
  'board_member': ReportConfig(label: 'Board Members', fields: [
    ReportField(key: 'name', label: 'Name'),
    ReportField(key: 'position', label: 'Position'),
    ReportField(key: 'bio', label: 'Bio'),
  ]),
};

class ReportsWidget extends StatefulWidget {
  final List<dynamic> allProfiles;
  final List<dynamic> allProjects;

  const ReportsWidget({
    super.key,
    required this.allProfiles,
    required this.allProjects,
  });

  @override
  State<ReportsWidget> createState() => _ReportsWidgetState();
}

class _ReportsWidgetState extends State<ReportsWidget> {
  String _selectedRole = 'projects';
  Set<String> _selectedFields = {};
  bool _exporting = false;

  @override
  void initState() {
    super.initState();
    _selectAllFields();
  }

  void _selectAllFields() {
    final config = reportConfigs[_selectedRole]!;
    setState(() {
      _selectedFields = config.fields.map((f) => f.key).toSet();
    });
  }

  List<dynamic> get _data {
    if (_selectedRole == 'projects') return widget.allProjects;
    return widget.allProfiles.where((p) => p['role'] == _selectedRole).toList();
  }

  List<ReportField> get _activeFields {
    final config = reportConfigs[_selectedRole]!;
    return config.fields.where((f) => _selectedFields.contains(f.key)).toList();
  }

  String _getValue(dynamic item, String key) {
    final val = item[key];
    if (val == null) return '';
    if (val is Map) return val['name'] ?? val.toString();
    return val.toString();
  }

  Future<void> _exportPDF() async {
    setState(() => _exporting = true);
    try {
      final config = reportConfigs[_selectedRole]!;
      final fields = _activeFields;
      final data = _data;

      final pdf = pw.Document();
      pdf.addPage(
        pw.MultiPage(
          pageFormat: PdfPageFormat.a4.landscape,
          header: (context) => pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text('FBGL Ministries - ${config.label} Report',
                  style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 4),
              pw.Text('Generated on: ${DateTime.now().toString().split('.')[0]}',
                  style: const pw.TextStyle(fontSize: 10)),
              pw.SizedBox(height: 12),
            ],
          ),
          build: (context) => [
            pw.TableHelper.fromTextArray(
              headers: fields.map((f) => f.label).toList(),
              data: data.map((item) => fields.map((f) => _getValue(item, f.key)).toList()).toList(),
              headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8),
              cellStyle: const pw.TextStyle(fontSize: 7),
              cellAlignment: pw.Alignment.centerLeft,
              headerDecoration: const pw.BoxDecoration(color: PdfColors.grey300),
            ),
          ],
        ),
      );

      await Printing.sharePdf(bytes: await pdf.save(), filename: '${config.label}_report.pdf');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('PDF export failed: $e')));
    } finally {
      setState(() => _exporting = false);
    }
  }

  Future<void> _exportExcel() async {
    setState(() => _exporting = true);
    try {
      final config = reportConfigs[_selectedRole]!;
      final fields = _activeFields;
      final data = _data;

      final excel = Excel.createExcel();
      final sheet = excel[config.label];

      // Headers
      for (int i = 0; i < fields.length; i++) {
        sheet.cell(CellIndex.indexByColumnRow(columnIndex: i, rowIndex: 0)).value = TextCellValue(fields[i].label);
      }

      // Data rows
      for (int r = 0; r < data.length; r++) {
        for (int c = 0; c < fields.length; c++) {
          sheet.cell(CellIndex.indexByColumnRow(columnIndex: c, rowIndex: r + 1)).value = TextCellValue(_getValue(data[r], fields[c].key));
        }
      }

      // Remove default 'Sheet1' if another sheet exists
      if (excel.sheets.containsKey('Sheet1') && excel.sheets.length > 1) {
        excel.delete('Sheet1');
      }

      final bytes = excel.save();
      if (bytes != null) {
        final blob = html.Blob([Uint8List.fromList(bytes)]);
        final url = html.Url.createObjectUrlFromBlob(blob);
        html.AnchorElement(href: url)
          ..setAttribute('download', '${config.label}_report.xlsx')
          ..click();
        html.Url.revokeObjectUrl(url);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Excel export failed: $e')));
    } finally {
      setState(() => _exporting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final config = reportConfigs[_selectedRole]!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Reports & Export', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryColor)),
        const SizedBox(height: 8),
        const Text('Generate and download reports in PDF or Excel format.', style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
        const SizedBox(height: 24),

        // Role Selector
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Select Report Type:', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: reportConfigs.entries.map((entry) {
                    final isSelected = _selectedRole == entry.key;
                    return ChoiceChip(
                      label: Text(entry.value.label),
                      selected: isSelected,
                      onSelected: (selected) {
                        if (selected) {
                          setState(() => _selectedRole = entry.key);
                          _selectAllFields();
                        }
                      },
                      selectedColor: AppTheme.secondaryColor,
                      labelStyle: TextStyle(color: isSelected ? Colors.white : null),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Field Selection
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Select Fields to Include:', style: TextStyle(fontWeight: FontWeight.bold)),
                    TextButton(
                      onPressed: _selectAllFields,
                      child: const Text('Select All'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: config.fields.map((field) {
                    return FilterChip(
                      label: Text(field.label),
                      selected: _selectedFields.contains(field.key),
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            _selectedFields.add(field.key);
                          } else {
                            _selectedFields.remove(field.key);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Export Buttons
        Row(
          children: [
            ElevatedButton.icon(
              onPressed: _exporting || _selectedFields.isEmpty ? null : _exportPDF,
              icon: const Icon(Icons.picture_as_pdf),
              label: const Text('Export PDF'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade700),
            ),
            const SizedBox(width: 12),
            ElevatedButton.icon(
              onPressed: _exporting || _selectedFields.isEmpty ? null : _exportExcel,
              icon: const Icon(Icons.table_chart),
              label: const Text('Export Excel'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade700),
            ),
            if (_exporting) ...[
              const SizedBox(width: 16),
              const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2)),
            ],
          ],
        ),
        const SizedBox(height: 24),

        // Preview Table
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Preview (${_data.length} records)', style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                _data.isEmpty
                    ? const Text('No data available for this report type.')
                    : SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          columnSpacing: 24,
                          columns: _activeFields.map((f) => DataColumn(label: Text(f.label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)))).toList(),
                          rows: _data.take(20).map((item) {
                            return DataRow(
                              cells: _activeFields.map((f) => DataCell(Text(_getValue(item, f.key), style: const TextStyle(fontSize: 11)))).toList(),
                            );
                          }).toList(),
                        ),
                      ),
                if (_data.length > 20)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text('... and ${_data.length - 20} more records. Export to see all.', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
