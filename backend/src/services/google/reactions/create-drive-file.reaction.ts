import { google } from 'googleapis';

export const createDriveFileReaction = {
  id: 'create_drive_file',
  name: 'Create Drive File',
  displayName: 'Create Drive File',
  description: 'Create a file in Google Drive',

  input: [
    {
      key: 'title',
      label: 'Title',
      type: 'string',
      required: true,
      placeholder: 'My document',
      helpText: 'Name of the Google Docs file to create.',
    },
  ],

  async execute({ token, params, googleService }) {
    if (!token) {
      throw new Error('Google account not connected.');
    }

    const title = String(params?.title ?? '').trim();
    if (!title) {
      throw new Error('Missing title');
    }

    const auth = await googleService.getOAuthClient(token.userId);

    const drive = google.drive({ version: 'v3', auth });

    const file = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
      },
    });

    return {
      fileId: file.data.id,
    };
  },
};
