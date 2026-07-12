import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:universal_html/html.dart' as html;

class ApiService {
  static String get baseUrl {
    try {
      final String? hostname = html.window.location.hostname;
      if (hostname == 'localhost' || hostname == '127.0.0.1') {
        return 'http://localhost:5000/api';
      }
    } catch (_) {}
    return 'https://fbgl-ministries-projects-backend.vercel.app/api';
  }

  static String? _token;

  void setToken(String? token) {
    _token = token;
  }

  Map<String, String> get _headers {
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  // GET Request
  Future<dynamic> get(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      );
      return _processResponse(response);
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }

  // POST Request
  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }

  // PUT Request
  Future<dynamic> put(String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }

  // DELETE Request
  Future<dynamic> delete(String endpoint) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      );
      return _processResponse(response);
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }

  // Multipart File Upload (multiple or single)
  Future<dynamic> uploadFile(String endpoint, Uint8List fileBytes, String filename, String mimeType, {Map<String, String>? fields}) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final request = http.MultipartRequest('POST', uri);
      
      if (_token != null) {
        request.headers['Authorization'] = 'Bearer $_token';
      }

      if (fields != null) {
        request.fields.addAll(fields);
      }

      final mediaTypeParts = mimeType.split('/');
      final type = mediaTypeParts[0];
      final subtype = mediaTypeParts.length > 1 ? mediaTypeParts[1] : 'jpeg';

      final multipartFile = http.MultipartFile.fromBytes(
        'images', // Matches field name in backend
        fileBytes,
        filename: filename,
        contentType: MediaType(type, subtype),
      );
      
      request.files.add(multipartFile);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      return _processResponse(response);
    } catch (e) {
      throw Exception('Upload error: $e');
    }
  }

  // Multipart Blog Cover Upload
  Future<dynamic> uploadBlogCover(String endpoint, Uint8List fileBytes, String filename, String mimeType, Map<String, String> fields, {bool isUpdate = false}) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final request = http.MultipartRequest(isUpdate ? 'PUT' : 'POST', uri);
      
      if (_token != null) {
        request.headers['Authorization'] = 'Bearer $_token';
      }

      request.fields.addAll(fields);

      final mediaTypeParts = mimeType.split('/');
      final type = mediaTypeParts[0];
      final subtype = mediaTypeParts.length > 1 ? mediaTypeParts[1] : 'jpeg';

      final multipartFile = http.MultipartFile.fromBytes(
        'cover_image', // Matches field name in backend
        fileBytes,
        filename: filename,
        contentType: MediaType(type, subtype),
      );
      
      request.files.add(multipartFile);

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      return _processResponse(response);
    } catch (e) {
      throw Exception('Cover upload error: $e');
    }
  }

  // Process Response Helper
  dynamic _processResponse(http.Response response) {
    final responseBody = response.body;
    dynamic decoded;
    try {
      decoded = jsonDecode(responseBody);
    } catch (_) {
      decoded = responseBody;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return decoded;
    } else {
      final errorMessage = (decoded is Map && decoded.containsKey('error'))
          ? decoded['error']
          : 'Request failed with status: ${response.statusCode}';
      throw Exception(errorMessage);
    }
  }
}
