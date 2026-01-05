import 'package:flutter/material.dart';

class HomepageScreen extends StatelessWidget {
  const HomepageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: scheme.surface,
      appBar: AppBar(
        backgroundColor: scheme.surface,
        elevation: 0,
        title: Text(
          "Welcome",
          style: TextStyle(
            color: scheme.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: ListView(
          children: [
            const SizedBox(height: 12),

            Text(
              "Automate your world in 3 steps",
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: scheme.onSurface,
              ),
            ),

            const SizedBox(height: 24),

            _TutorialCard(
              icon: Icons.apps,
              title: "1. Choose a service",
              description:
                  "Start by picking a service like Gmail, GitHub, Weather, Slack…",
              color: scheme.primary,
              onTap: () => Navigator.pushNamed(context, "/services"),
            ),

            const SizedBox(height: 16),

            _TutorialCard(
              icon: Icons.bolt,
              title: "2. Create an AREA",
              description:
                  "Combine an IF trigger with a THEN reaction to automate something.",
              color: scheme.primary,
              onTap: () => Navigator.pushNamed(context, "/create-area"),
            ),

            const SizedBox(height: 16),

            _TutorialCard(
              icon: Icons.list_alt,
              title: "3. Manage your AREAs",
              description:
                  "Enable, disable, or edit your automations anytime.",
              color: scheme.primary,
              onTap: () => Navigator.pushNamed(context, "/areas"),
            ),

            const SizedBox(height: 32),

            Divider(color: scheme.onSurface.withOpacity(0.2)),
            const SizedBox(height: 16),

            Text(
              "Your recent AREAs",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: scheme.onSurface,
              ),
            ),

            const SizedBox(height: 12),

            // Example placeholder — you can replace with your real list
            _ExampleAreaRow(
              from: "Gmail",
              to: "Slack",
              title: "Forward important emails",
              time: "2 days ago",
            ),
          ],
        ),
      ),
    );
  }
}

class _TutorialCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final Color color;
  final VoidCallback onTap;

  const _TutorialCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: scheme.onSurface.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: scheme.onSurface.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: scheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: scheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ExampleAreaRow extends StatelessWidget {
  final String from;
  final String to;
  final String title;
  final String time;

  const _ExampleAreaRow({
    required this.from,
    required this.to,
    required this.title,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: scheme.primary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(from, style: TextStyle(color: scheme.onPrimary)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: TextStyle(
                      fontSize: 14, color: scheme.onSurface)),
              const SizedBox(height: 4),
              Icon(Icons.arrow_forward, size: 18, color: scheme.onSurface),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.green,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Text("→", style: TextStyle(color: Colors.white)),
        ),
        const SizedBox(width: 12),
        Text(
          time,
          style: TextStyle(
            fontSize: 12,
            color: scheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }
}
