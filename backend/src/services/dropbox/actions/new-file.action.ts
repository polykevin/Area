export const newFileAction = {
  id: 'new_file',
  name: 'New File Added',
  displayName: 'New File Added',
  description: 'Triggers when a new file is added.',
  input: [
    {
      key: 'folder',
      label: 'Folder (optional)',
      type: 'string',
      required: false,
      placeholder: '/uploads',
      helpText: 'Only trigger for new files inside this folder.',
    },
    {
      key: 'contains',
      label: 'Filename contains (optional)',
      type: 'string',
      required: false,
      placeholder: '.pdf',
      helpText: 'Only trigger if the filename contains this text.',
    },
  ],

  match: (payload, params) => {
    if (!params) return true;

    //optional filter: folder startsWith (path_lower)
    if (params.folder && typeof payload?.path_lower === 'string') {
      if (!payload.path_lower.startsWith(String(params.folder).toLowerCase())) return false;
    }

    //optional filter: contains (name)
    if (params.contains && typeof payload?.name === 'string') {
      return payload.name.includes(params.contains);
    }

    return true;
  }
};
