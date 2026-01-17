export const fileChangedAction = {
  id: 'file_changed',
  name: 'file_changed',
  displayName: 'File Changed',
  description: 'Triggers when an existing file is modified.',

  input: [
    {
      key: 'folder',
      label: 'Folder (optional)',
      type: 'string',
      required: false,
      placeholder: '/my-folder',
      helpText: 'Only trigger for files inside this folder.',
    },
    {
      key: 'contains',
      label: 'Filename contains (optional)',
      type: 'string',
      required: false,
      placeholder: 'report',
      helpText: 'Only trigger if the filename contains this text.',
    },
  ],

  match: (payload: any, params: any) => {
    if (!params) return true;

    if (params.folder && typeof payload?.path_lower === 'string') {
      if (!payload.path_lower.startsWith(String(params.folder).toLowerCase())) return false;
    }

    if (params.contains && typeof payload?.name === 'string') {
      return payload.name.includes(params.contains);
    }

    return true;
  },
};
