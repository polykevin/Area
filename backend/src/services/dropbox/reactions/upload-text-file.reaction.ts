export const uploadTextFileReaction = {
  id: 'upload_text_file',
  name: 'Upload a Text File',
  displayName: 'Upload Text File',
  description: 'Uploads a new text file with the provided content.'

  execute: async ({ token, params, dropboxService }) => {
    if (!token) {
      throw new Error('Dropbox account not connected.');
    }

    const { path, content } = params;
    if (!path) throw new Error('Missing "path"');
    if (content === undefined || content === null) throw new Error('Missing "content"');

    await dropboxService.uploadTextFile(token.userId, path, String(content));

    return { success: true };
  },
};
