import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';
import 'service_screen.dart';
class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  int _columns = 2; // default grid mode

  final List<Map<String, dynamic>> _allServices = [
    {"key": "google", "name": "Gmail", "color": Colors.red, "logoAsset": "assets/icons/gmail.png"},
    {"key": "instagram", "name": "Instagram", "color": Colors.pink, "logoAsset": "assets/icons/instagram.png"},
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    // Filter services based on query
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

            // header area
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
                        prefixIcon: Icon(Icons.search,
                            size: 20,
                            color: Theme.of(context).iconTheme.color),
                        contentPadding:
                        const EdgeInsets.symmetric(vertical: 8),
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
                  childAspectRatio:
                  _columns == 1 ? 5 : (_columns == 2 ? 1.6 : 1),
                  children: filtered.map((s) {
                    return GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ServiceScreen(
                              serviceKey: s["key"] as String,
                              name: s["name"] as String,
                              bannerColor: s["color"] as Color,
                              logoAsset: s["logoAsset"] as String,
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
