import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../api/api_client.dart';
import '../../providers/auth_provider.dart';
import '../../models/service.dart';

class ServiceScreen extends StatefulWidget {
  final Service service;
  final Color bannerColor;
  final String logoAsset;

  const ServiceScreen({
    super.key,
    required this.service,
    this.bannerColor = Colors.grey,
    required this.logoAsset,
  });

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  bool _connecting = false;
  bool _connected = false;
  String? _connectError;

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
      final url = '$apiBaseUrl/oauth/${widget.service.id}/url?userId=$userId';

      final ok = await launchUrl(
        Uri.parse(url),
        mode: LaunchMode.externalApplication,
      );

      if (!ok) throw Exception('Could not open browser');

      if (!mounted) return;
      setState(() {
        _connected = true;
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
  // FILTER
  // -----------------------------
  List<T> _filtered<T>(List<T> items, String Function(T) keyOf) {
    final q = _query.trim().toLowerCase();
    if (q.isEmpty) return items;
    return items.where((x) => keyOf(x).toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    final actions = widget.service.actions;
    final reactions = widget.service.reactions;

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
            widget.service.displayName,
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
            _buildListTab<ServiceAction>(
              context,
              title: 'Actions',
              subtitle:
              'Choose what can trigger an AREA for ${widget.service.displayName}.',
              items: _filtered(actions, (a) => a.displayName),
              emptyText: 'No actions available for this service.',
              itemTitle: (a) => a.displayName,
              itemSubtitle: (a) => a.description,
            ),
            _buildListTab<ServiceReaction>(
              context,
              title: 'Reactions',
              subtitle:
              'Choose what ${widget.service.displayName} can do when an AREA runs.',
              items: _filtered(reactions, (r) => r.displayName),
              emptyText: 'No reactions available for this service.',
              itemTitle: (r) => r.displayName,
              itemSubtitle: (r) => r.description,
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
    final cs = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
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
                  Image.asset(
                    widget.logoAsset,
                    width: 88,
                    height: 88,
                    errorBuilder: (_, __, ___) => const Icon(
                      Icons.extension,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    widget.service.displayName,
                    style: const TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

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
                style: TextStyle(color: cs.error, fontSize: 12),
              ),
            ),
          ],

          const Spacer(),

          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _connecting ? null : _connect,
              style: ElevatedButton.styleFrom(
                backgroundColor: cs.primary,
                foregroundColor: cs.onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: _connecting
                  ? const CircularProgressIndicator(strokeWidth: 2)
                  : Text(_connected ? 'Reconnect' : 'Connect'),
            ),
          ),
        ],
      ),
    );
  }

  // -----------------------------
  // LIST TAB
  // -----------------------------
  Widget _buildListTab<T>(
      BuildContext context, {
        required String title,
        required String subtitle,
        required List<T> items,
        required String emptyText,
        required String Function(T) itemTitle,
        required String Function(T) itemSubtitle,
      }) {
    final cs = Theme.of(context).colorScheme;

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

          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search $title...',
              prefixIcon: const Icon(Icons.search),
            ),
            onChanged: (v) => setState(() => _query = v),
          ),

          const SizedBox(height: 16),

          Expanded(
            child: items.isEmpty
                ? Center(child: Text(emptyText))
                : ListView.separated(
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, i) {
                final item = items[i];
                return _ActionCard(
                  title: itemTitle(item),
                  subtitle: itemSubtitle(item),
                  color: widget.bannerColor,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final Color color;

  const _ActionCard({
    required this.title,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: cs.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: cs.onSurface,
                ),
              ),
            ],
          ),
          if (subtitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 13,
                color: cs.onSurface.withOpacity(0.75),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
