import 'package:flutter/material.dart';
import 'package:universal_html/html.dart' as html;
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  Map<String, dynamic>? _currentUser;
  bool _isLoading = true;
  String? _error;

  Map<String, dynamic>? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;

  String? get role => _currentUser?['role'];
  String? get userId => _currentUser?['_id'] ?? _currentUser?['id'];
  String? get name => _currentUser?['name'];

  AuthProvider() {
    _tryAutoLogin();
  }

  Future<void> _tryAutoLogin() async {
    try {
      final token = html.window.localStorage['auth_token'];
      if (token != null && token.isNotEmpty) {
        _apiService.setToken(token);
        final response = await _apiService.post('/auth/login-verify', {});
        if (response != null && response['user'] != null) {
          _currentUser = response['user'];
        } else {
          html.window.localStorage.remove('auth_token');
          _apiService.setToken(null);
        }
      }
    } catch (e) {
      print('Auto-login failed: $e');
      html.window.localStorage.remove('auth_token');
      _apiService.setToken(null);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response != null && response['token'] != null) {
        final token = response['token'];
        html.window.localStorage['auth_token'] = token;
        _apiService.setToken(token);
        _currentUser = response['user'];
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        throw Exception('Invalid response from server');
      }
    } catch (e) {
      _isLoading = false;
      _error = e.toString().replaceAll('Exception: ', '');
      _apiService.setToken(null);
      html.window.localStorage.remove('auth_token');
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    _currentUser = null;
    _apiService.setToken(null);
    html.window.localStorage.remove('auth_token');
    
    _isLoading = false;
    notifyListeners();
  }
}
