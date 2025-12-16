import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  int _columns = 2;

  final List<Map<String, dynamic>> _allServices = [
    {"name": "Gmail", "color": Colors.red},
    {"name": "Spotify", "color": Colors.green},
    {"name": "Github", "color": Colors.black},
    {"name": "Outlook", "color": Colors.blue},
    {"name": "Soundcloud", "color": Colors.orange},
    {"name": "Twitch", "color": Colors.purple},
    {"name": "Instagram", "color": Colors.pink},
    {"name": "X", "color": Colors.black},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _allServices
        .where((s) => s["name"]
        .toString()
        .toLowerCase()
        .contains(_query.toLowerCase()))
        .toList();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),

            // Grey header area
            Container(
              height: 120,
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

            // Search bar + toggle buttons row
            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 40,
                    child: TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: "Search...",
                        prefixIcon: const Icon(Icons.search, size: 20),
                        contentPadding: const EdgeInsets.symmetric(vertical: 8),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onChanged: (val) => setState(() => _query = val),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ToggleButtons(
                  isSelected: [
                    _columns == 1,
                    _columns == 2,
                    _columns == 3,
                  ],
                  onPressed: (index) {
                    setState(() {
                      if (index == 0) _columns = 1;
                      if (index == 1) _columns = 2;
                      if (index == 2) _columns = 3;
                    });
                  },
                  borderRadius: BorderRadius.circular(8),
                  selectedColor: Colors.black,
                  color: Colors.black,
                  children: const [
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.view_agenda),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.grid_view),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.apps),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Services grid
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: GridView.count(
                  key: ValueKey("${filtered.length}-$_columns"),
                  crossAxisCount: _columns,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: _columns == 1 ? 5 : (_columns == 2 ? 1.6 : 1),
                  children: filtered.map((s) {
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
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
            ),
          ],
        ),
      ),
    );
  }
}