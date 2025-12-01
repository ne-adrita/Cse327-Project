import 'package:flutter/material.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // later: charts, triggers, hormone pattern etc.
    return Scaffold(
      appBar: AppBar(title: const Text("Analytics / Mood Stats")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _StatCard(
            title: "Most common mood",
            value: "Anxious → Calm",
            note: "You usually recover in ~2 hrs",
          ),
          _StatCard(
            title: "Triggers",
            value: "Lack of sleep, social stress",
            note: "Pattern detected 4 times this week",
          ),
          _StatCard(
            title: "Sleep quality trend",
            value: "Improving 😴",
            note: "Avg sleep 6h → 7h",
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String note;
  const _StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.note,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            Text(
              note,
              style: const TextStyle(fontSize: 13, color: Colors.black54),
            ),
          ],
        ),
      ),
    );
  }
}
