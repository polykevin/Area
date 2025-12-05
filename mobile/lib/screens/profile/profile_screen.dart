import 'dart:io';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';

import '../../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _changeAvatar(BuildContext context) async {
    final auth = context.read<AuthProvider>();
    final user = auth.user;

    if (user?.provider == 'google') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile photo comes from Google. Change it in your Google account.'),
        ),
      );
      return;
    }

    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 800,
      imageQuality: 80,
    );

    if (picked == null) return;

    try {
      await auth.setLocalAvatarFromFile(picked);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile picture updated')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update profile picture')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    final displayName =
        user?.displayName ?? user?.email.split('@').first ?? 'Unknown user';
    final email = user?.email ?? 'Unknown email';
    final provider = user?.provider ?? 'Unknown provider';
    final createdAt = user?.createdAt;
    final avatarUrl = auth.avatarUrl;

    final isGoogle = provider.toLowerCase() == 'google';

    ImageProvider? avatarImage;
    if (avatarUrl != null) {
      if (avatarUrl.startsWith('http')) {
        avatarImage = NetworkImage(avatarUrl);
      } else {
        avatarImage = FileImage(File(avatarUrl));
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 16),
            Center(
              child: Stack(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.purple.shade100,
                    backgroundImage: avatarImage,
                    child: avatarImage == null ? const Icon(
                      Icons.person,
                      size: 40,
                      color: Colors.white,
                    )
                        : null,
                  ),
                  if (!isGoogle)
                    Positioned(
                      bottom: -2,
                      right: -2,
                      child: InkWell(
                        onTap: () => _changeAvatar(context),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.black87,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.camera_alt,
                            size: 18,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              displayName,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              email,
              style: const TextStyle(fontSize: 14, color: Colors.black54),
            ),
            const SizedBox(height: 24),
            const Divider(),
            const SizedBox(height: 8),
            _InfoRow(label: 'User ID', value: user?.id.toString() ?? '-'),
            _InfoRow(label: 'Provider', value: provider),
            _InfoRow(
              label: 'Created at',
              value: createdAt != null ? DateFormat('dd.MM.yyyy HH:mm:ss')
                  .format(createdAt.toLocal()) : '-',
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () async {
                  await auth.logout();
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                child: const Text(
                  'Log out',
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
