class JournalEntry {
  final int id;
  final String mood;
  final String text;
  final String date;

  JournalEntry({
    required this.id,
    required this.mood,
    required this.text,
    required this.date,
  });

  factory JournalEntry.fromJson(Map<String, dynamic> json) {
    return JournalEntry(
      id: json['id'],
      mood: json['mood'],
      text: json['text'],
      date: json['date'],
    );
  }
}
