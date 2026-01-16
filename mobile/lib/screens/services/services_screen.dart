import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/services_provider.dart';
import 'service_screen.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  int _columns = 2;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      context.read<ServicesProvider>().loadServices();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Color _colorFromHex(String? hex) {
    if (hex == null || hex.trim().isEmpty) return Colors.grey;

    final cleaned = hex.trim().replaceAll('#', '');
    if (cleaned.length != 6) return Colors.grey;

    try {
      return Color(int.parse('FF$cleaned', radix: 16));
    } catch (_) {
      return Colors.grey;
    }
  }

  Color _onServiceColor(Color bg) {
    return ThemeData.estimateBrightnessForColor(bg) == Brightness.dark
        ? Colors.white
        : Colors.black;
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ServicesProvider>();
    final services = provider.services;
    final loading = provider.loading;

    // Filter by search query
    final filtered = services
        .where((s) => s.displayName.toLowerCase().contains(_query.toLowerCase()))
        .toList();

    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Scaffold(
      backgroundColor: cs.surface,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),

            // Header
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: cs.secondary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  "SERVICES",
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: cs.onSurface,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Search + layout toggle
            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 40,
                    child: TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: "Search...",
                        prefixIcon: Icon(
                          Icons.search,
                          size: 20,
                          color: theme.iconTheme.color,
                        ),
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
                    setState(() => _columns = index + 1);
                  },
                  borderRadius: BorderRadius.circular(8),
                  selectedColor: cs.onSurface,
                  color: cs.onSurface,
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

            // Loading indicator
            if (loading)
              const Expanded(
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              )
            else
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
                      final serviceColor = _colorFromHex(s.color);

                      // Match AreasScreen "tag" vibe: full solid color, rounded.
                      // (No opacity, no light background.)
                      final textColor = _onServiceColor(serviceColor);

                      return GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => ServiceScreen(
                                service: s,
                                bannerColor: serviceColor,
                                logoAsset: "assets/icons/${s.id}.png",
                              ),
                            ),
                          );
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                          decoration: BoxDecoration(
                            color: serviceColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              s.displayName,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: textColor,
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
