export const uploadTextFileReaction = {
  id: 'upload_text_file',
  name: 'Upload a Text File',
  displayName: 'Upload Text File',
  description: 'Uploads a new text file with the provided content.',
  input: [
    {
      key: 'path',
      label: 'Destination path',
      type: 'string',
      required: true,
      placeholder: '/notes/todo.txt',
      helpText: 'Full destination path including filename.',
    },
    {
      key: 'content',
      label: 'File content',
      type: 'string',
      required: true,
      placeholder: 'Hello world',
      helpText: 'Text content to write into the file.',
    },
  ],

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
