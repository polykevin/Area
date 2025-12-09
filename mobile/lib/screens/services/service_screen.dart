import 'package:flutter/material.dart';
import 'services_screen.dart';
import '../../providers/theme_provider.dart';

class ServiceScreen extends StatefulWidget {
  final String name;
  final Color bannerColor;
  final String logoAsset;

  const ServiceScreen({
    super.key,
    required this.name,
    this.bannerColor = Colors.grey,
    required this.logoAsset,
  });

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  // Example data per section
  final Map<String, List<String>> _sectionData = {
    "Triggers": ["Song is played", "Album is saved", "New song added", "Show is played"],
    "Queries": ["Search playlist", "Find artist"],
    "Reactions": ["Send notification", "Add to playlist"]
  };

  String _activeSection = "Triggers";

  @override
  Widget build(BuildContext context) {
    final sectionItems = _sectionData[_activeSection] ?? [];

    // Filter items by search query
    final filtered = sectionItems
        .where((a) => a.toLowerCase().contains(_query.toLowerCase()))
        .toList();

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Theme.of(context).iconTheme.color),
          onPressed: () {
            Navigator.of(context).pop(); // go back to existing ServicesScreen
          },
        ),
        title: Text(
          widget.name,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Top banner
            Container(
              height: 136,
              decoration: BoxDecoration(
                color: widget.bannerColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 24),
                  Image.asset(widget.logoAsset, width: 88, height: 88),
                  const SizedBox(width: 16),
                  Text(
                    widget.name,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontWeight: FontWeight.w700,
                      fontSize: 40,
                      letterSpacing: -0.02,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Section selectors
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _SectionButton(
                  label: "Triggers",
                  active: _activeSection == "Triggers",
                  onTap: () => setState(() => _activeSection = "Triggers"),
                ),
                _SectionButton(
                  label: "Queries",
                  active: _activeSection == "Queries",
                  onTap: () => setState(() => _activeSection = "Queries"),
                ),
                _SectionButton(
                  label: "Reactions",
                  active: _activeSection == "Reactions",
                  onTap: () => setState(() => _activeSection = "Reactions"),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Search bar
            SizedBox(
              height: 40,
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: "Search...",
                  prefixIcon: Icon(Icons.search,
                      size: 20, color: Theme.of(context).iconTheme.color),
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onChanged: (val) => setState(() => _query = val),
              ),
            ),

            const SizedBox(height: 16),

            // Section content
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Text(
                        "$_activeSection are not available for this service",
                        style: TextStyle(
                          fontSize: 16,
                          fontStyle: FontStyle.italic,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                    )
                  : GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 1.2,
                      children: filtered.map((action) {
                        return _ActionBanner(
                          text: action,
                          color: widget.bannerColor,
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

class _ActionBanner extends StatelessWidget {
  final String text;
  final Color color;

  const _ActionBanner({required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w600,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}

class _SectionButton extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _SectionButton({
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Text(
        label,
        style: TextStyle(
          fontSize: 20,
          fontWeight: active ? FontWeight.bold : FontWeight.normal,
          decoration: active ? TextDecoration.underline : null,
          color: Theme.of(context).colorScheme.onSurface,
        ),
      ),
    );
  }
}

