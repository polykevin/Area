import 'package:flutter/material.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final services = [
      {"name": "Spotify", "color": Colors.green},
      {"name": "Youtube", "color": Colors.red},
      {"name": "Github", "color": Colors.black},
      {"name": "Outlook", "color": Colors.blue},
      {"name": "Soundcloud", "color": Colors.orange},
      {"name": "Twitch", "color": Colors.purple},
      {"name": "Instagram", "color": Colors.pink},
      {"name": "X", "color": Colors.black},
    ];

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              radius: 16,
              backgroundColor: Colors.purple.shade100,
              child: Icon(Icons.person, color: Colors.purple.shade700),
            ),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Grey header card
            Container(
              height: 160,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: Text(
                  "SERVICES",
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Search bar
            TextField(
              decoration: const InputDecoration(
                hintText: "Search",
                prefixIcon: Icon(Icons.search),
              ),
            ),

            const SizedBox(height: 16),

            // Grid
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.6,
                children: services.map((s) {
                  return Container(
                    decoration: BoxDecoration(
                      color: s["color"] as Color,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        s["name"] as String,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
