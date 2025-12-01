import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static Future<String> sendMessage(String userMsg) async {
    final hfToken = dotenv.env['HF_API_KEY'];

    if (hfToken == null || hfToken.isEmpty) {
      return "❌ HF_TOKEN missing from .env file!";
    }

    // Small LLM (BioGPT)
    final url = Uri.parse(
      "https://api-inference.huggingface.co/models/microsoft/biogpt",
    );

    final headers = {
      "Authorization": "Bearer $hfToken",
      "Content-Type": "application/json",
    };

    final body = {
      "inputs": userMsg,
      "parameters": {"max_new_tokens": 180, "temperature": 0.4},
    };

    try {
      final response = await http
          .post(url, headers: headers, body: jsonEncode(body))
          .timeout(const Duration(seconds: 60));

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        if (decoded is List && decoded.isNotEmpty) {
          return decoded[0]["generated_text"] ?? "⚠ No text generated.";
        }
        return "⚠ Unexpected response format";
      }

      return "❌ Error ${response.statusCode}: ${response.body}";
    } catch (e) {
      return "⛔ Request failed: $e";
    }
  }
}
