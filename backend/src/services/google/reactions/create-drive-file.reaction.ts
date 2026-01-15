import { google } from 'googleapis';

export const createDriveFileReaction = {
  id: 'google_create_drive_file',
  name: 'Create Google Drive file',

  async execute({ token, params, event }) {
    if (!token?.accessToken) {
      throw new Error('Google not connected');
    }

    const oauth = new google.auth.OAuth2();
    oauth.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken ?? undefined,
    });

    const drive = google.drive({ version: 'v3', auth: oauth });

    const fileName =
      params?.name ??
      `Trello card - ${event?.name ?? 'Untitled'}`;

    await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/vnd.google-apps.document',
      },
    });

    return { success: true };
  },
};
