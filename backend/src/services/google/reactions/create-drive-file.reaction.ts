import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';

export const createDriveFileReaction = {
  id: 'create_drive_file',
  displayName: 'Create file in Google Drive',
  description: 'Create a Google Drive file from Trello card',

  async run({ userId, payload, config }) {
    const authRepo = ServiceAuthRepository.getInstance?.() ?? config.authRepo;
    const configService: ConfigService = config.configService;

    const record = await authRepo.findByUserAndService(userId, 'google');
    if (!record) return;

    const oauth = new google.auth.OAuth2(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
      configService.get('GOOGLE_REDIRECT_URI'),
    );

    oauth.setCredentials({
      access_token: record.accessToken,
      refresh_token: record.refreshToken ?? undefined,
    });

    const drive = google.drive({ version: 'v3', auth: oauth });

    const fileName = payload.name ?? 'Trello card';
    const content = payload.desc ?? 'No description';

    await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'text/plain',
        parents: config.folderId ? [config.folderId] : undefined,
      },
      media: {
        mimeType: 'text/plain',
        body: content,
      },
    });

    console.log('📁 Drive file created from Trello card:', fileName);
  },
};
