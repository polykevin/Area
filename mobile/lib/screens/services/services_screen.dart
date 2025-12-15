import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
<<<<<<< HEAD

=======
import '../../providers/theme_provider.dart';
import 'service_screen.dart';
>>>>>>> main
class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
<<<<<<< HEAD
  int _columns = 2;
=======
  int _columns = 2; // default grid mode
>>>>>>> main

  final List<Map<String, dynamic>> _allServices = [
    {"name": "Spotify", "color": Colors.green},
    {"name": "Youtube", "color": Colors.red},
    {"name": "Github", "color": Colors.black},
    {"name": "Outlook", "color": Colors.blue},
    {"name": "Soundcloud", "color": Colors.orange},
    {"name": "Twitch", "color": Colors.purple},
    {"name": "Instagram", "color": Colors.pink},
    {"name": "X", "color": Colors.black},
  ];

  @override
  Widget build(BuildContext context) {
<<<<<<< HEAD
=======
    final auth = context.watch<AuthProvider>();

    // Filter services based on query
>>>>>>> main
    final filtered = _allServices
        .where((s) => s["name"]
            .toString()
            .toLowerCase()
            .contains(_query.toLowerCase()))
        .toList();

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),

<<<<<<< HEAD
            // Grey header area
=======
            // header area
>>>>>>> main
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.secondary.withOpacity((0.1)),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  "SERVICES",
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
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
<<<<<<< HEAD
                        prefixIcon: const Icon(Icons.search, size: 20),
                        contentPadding: const EdgeInsets.symmetric(vertical: 8),
=======
                        prefixIcon: Icon(Icons.search,
                            size: 20,
                            color: Theme.of(context).iconTheme.color),
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 8),
>>>>>>> main
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
<<<<<<< HEAD
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
=======
                  selectedColor: Theme.of(context).colorScheme.onSurface,
                  color: Theme.of(context).colorScheme.onSurface,
                  children: const [
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.view_agenda), // list
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.grid_view), // 2-column
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.apps), // 3-column
>>>>>>> main
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
<<<<<<< HEAD
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
=======
                  childAspectRatio:
                      _columns == 1 ? 5 : (_columns == 2 ? 1.6 : 1),
                  children: filtered.map((s) {
                    return GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ServiceScreen(
                              name: s["name"] as String,
                              bannerColor: s["color"] as Color,
                              logoAsset: "",
                            ),
                          ),
                        );
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                        decoration: BoxDecoration(
                          color: s["color"] as Color,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            s["name"] as String,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
>>>>>>> main
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
