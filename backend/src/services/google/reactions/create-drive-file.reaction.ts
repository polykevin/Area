import { google } from 'googleapis';

<<<<<<< HEAD
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
=======
export const GoogleCreateDriveFileReaction = {
  name: 'google.create_drive_file',
  description: 'Create a file in Google Drive',
  run: async (payload: any, context: any) => {
    const auth = context.googleAuth;

    const drive = google.drive({ version: 'v3', auth });

    const file = await drive.files.create({
      requestBody: {
        name: payload.title,
>>>>>>> 1a7f805
        mimeType: 'application/vnd.google-apps.document',
      },
    });

<<<<<<< HEAD
    return { success: true };
=======
    return {
      fileId: file.data.id,
    };
>>>>>>> 1a7f805
  },
};
