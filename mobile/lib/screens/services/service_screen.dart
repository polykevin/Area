import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../api/api_client.dart';
import '../../providers/auth_provider.dart';

class ServiceScreen extends StatefulWidget {
  final String serviceKey; // e.g. "google", "instagram"
  final String name;
  final Color bannerColor;
  final String logoAsset;

  const ServiceScreen({
    super.key,
    required this.serviceKey,
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

  late final List<String> _actions;
  late final List<String> _reactions;

  bool _connecting = false;
  bool _connected = false; // you can later load this from API
  String? _connectError;

  @override
  void initState() {
    super.initState();
    _actions = _actionsFor(widget.serviceKey);
    _reactions = _reactionsFor(widget.serviceKey);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _connect() async {
    setState(() {
      _connecting = true;
      _connectError = null;
    });

    try {
      final auth = context.read<AuthProvider>();

      final userId = auth.user?.id;
      if (userId == null) {
        throw Exception('User not logged in (missing userId)');
      }

      final apiBaseUrl = ApiClient().baseUrl;

      final url =
          '$apiBaseUrl/oauth/${widget.serviceKey}/url?userId=$userId';

      final uri = Uri.parse(url);

      final ok = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );

      if (!ok) {
        throw Exception('Could not open browser for $url');
      }

      if (!mounted) return;
      setState(() {
        _connected = true; // optimistic; later refresh from backend
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _connectError = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _connecting = false;
        });
      }
    }
  }

  // -----------------------------
  // UI HELPERS
  // -----------------------------
  List<String> _filtered(List<String> items) {
    final q = _query.trim().toLowerCase();
    if (q.isEmpty) return items;
    return items.where((x) => x.toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: cs.surface,
        appBar: AppBar(
          backgroundColor: cs.surface,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: cs.onSurface),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Text(
            widget.name,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: cs.onSurface,
            ),
          ),
          bottom: TabBar(
            labelColor: cs.primary,
            unselectedLabelColor: cs.onSurface.withOpacity(0.6),
            indicatorColor: cs.primary,
            tabs: const [
              Tab(text: 'Connect'),
              Tab(text: 'Actions'),
              Tab(text: 'Reactions'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildConnectTab(context),
            _buildListTab(
              context,
              title: 'Actions',
              subtitle: 'Choose what can trigger an AREA for ${widget.name}.',
              items: _filtered(_actions),
              emptyText: 'No actions available for this service.',
            ),
            _buildListTab(
              context,
              title: 'Reactions',
              subtitle: 'Choose what ${widget.name} can do when an AREA runs.',
              items: _filtered(_reactions),
              emptyText: 'No reactions available for this service.',
            ),
          ],
        ),
      ),
    );
  }

  // -----------------------------
  // CONNECT TAB
  // -----------------------------
  Widget _buildConnectTab(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final description = serviceDescription(widget.serviceKey);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Banner
          Container(
            height: 136,
            decoration: BoxDecoration(
              color: widget.bannerColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const SizedBox(width: 24),
                if (widget.logoAsset.isNotEmpty)
                  Image.asset(widget.logoAsset, width: 88, height: 88),
                if (widget.logoAsset.isNotEmpty) const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    widget.name,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontWeight: FontWeight.w700,
                      fontSize: 36,
                      letterSpacing: -0.02,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
              ],
            ),
          ),

          const SizedBox(height: 18),

          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              description,
              style: TextStyle(
                fontSize: 15,
                color: cs.onSurface.withOpacity(0.8),
                height: 1.35,
              ),
            ),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Icon(
                _connected ? Icons.verified : Icons.link_off,
                color: _connected ? Colors.green : cs.onSurface.withOpacity(0.6),
              ),
              const SizedBox(width: 8),
              Text(
                _connected ? 'Connected' : 'Not connected',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: cs.onSurface,
                ),
              ),
            ],
          ),

          if (_connectError != null) ...[
            const SizedBox(height: 10),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                _connectError!,
                style: TextStyle(
                  color: cs.error,
                  fontSize: 12,
                ),
              ),
            ),
          ],

          const Spacer(),

          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: cs.primary,
                foregroundColor: cs.onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              onPressed: _connecting ? null : _connect,
              child: _connecting
                  ? SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(cs.onPrimary),
                ),
              )
                  : Text(_connected ? 'Reconnect' : 'Connect'),
            ),
          ),

          const SizedBox(height: 10),

          // Optional: let user see which URL we open (useful while dev)
          Text(
            'Opens: ${ApiClient().baseUrl}/oauth/${widget.serviceKey}/url',
            style: TextStyle(
              fontSize: 12,
              color: cs.onSurface.withOpacity(0.6),
            ),
          ),
        ],
      ),
    );
  }

  // -----------------------------
  // ACTIONS / REACTIONS TABS
  // -----------------------------
  Widget _buildListTab(
      BuildContext context, {
        required String title,
        required String subtitle,
        required List<String> items,
        required String emptyText,
      }) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              subtitle,
              style: TextStyle(
                fontSize: 14,
                color: cs.onSurface.withOpacity(0.75),
              ),
            ),
          ),
          const SizedBox(height: 12),

          SizedBox(
            height: 44,
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: "Search $title...",
                prefixIcon: Icon(Icons.search,
                    size: 20, color: cs.onSurface.withOpacity(0.7)),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (val) => setState(() => _query = val),
            ),
          ),

          const SizedBox(height: 16),

          Expanded(
            child: items.isEmpty
                ? Center(
              child: Text(
                emptyText,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontStyle: FontStyle.italic,
                  color: cs.onSurface.withOpacity(0.75),
                ),
              ),
            )
                : ListView.separated(
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = items[index];
                return _ActionCard(
                  text: item,
                  color: widget.bannerColor,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item)),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // -----------------------------
  // Demo stubs (replace with API)
  // -----------------------------
  static List<String> _actionsFor(String serviceKey) {
    switch (serviceKey) {
      case 'google':
        return [
          'New Email Received',
          'New Email From Specific Sender',
        ];
      case 'instagram':
        return [
          'New Post Published',
          'New Follower',
        ];
      default:
        return ['No actions defined'];
    }
  }

  static List<String> _reactionsFor(String serviceKey) {
    switch (serviceKey) {
      case 'google':
        return [
          'Send Email',
        ];
      case 'instagram':
        return [
          'Post Photo',
          'Post Story',
        ];
      default:
        return ['No reactions defined'];
    }
  }
}

class _ActionCard extends StatelessWidget {
  final String text;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.text,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: cs.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: cs.outlineVariant),
        ),
        child: Row(
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  fontSize: 15,
                  color: cs.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(Icons.chevron_right, color: cs.onSurface.withOpacity(0.6)),
          ],
        ),
      ),
    );
  }
}

String serviceDescription(String key) {
  switch (key) {
    case 'google':
    case 'google':
      return 'Connect Gmail to trigger automations when emails arrive and send messages automatically.';
    case 'instagram':
      return 'Connect Instagram to react to new followers/posts and publish content from your AREAs.';
    default:
      return 'Connect this service to use its actions and reactions.';
  }
}
