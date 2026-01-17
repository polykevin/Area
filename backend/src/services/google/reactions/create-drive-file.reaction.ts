import { google } from 'googleapis';

export const GoogleCreateDriveFileReaction = {
  name: 'google.create_drive_file',
  description: 'Create a file in Google Drive',
  run: async (payload: any, context: any) => {
    const auth = context.googleAuth;

    const drive = google.drive({ version: 'v3', auth });

    const file = await drive.files.create({
      requestBody: {
        name: payload.title,
        mimeType: 'application/vnd.google-apps.document',
      },
    });

    return {
      fileId: file.data.id,
    };
  },
};
