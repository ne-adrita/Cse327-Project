import 'package:flutter/material.dart';

class CalendarScreen extends StatelessWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // later: mood calendar heatmap / postpartum timeline etc.
    return Scaffold(
      appBar: AppBar(title: const Text("Calendar")),
      body: const Center(
        child: Text(
          "Calendar view coming soon",
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
