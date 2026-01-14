export const fileChangedAction = {
  id: 'file_changed',
  name: 'File Changed',

  match: (payload, params) => {
    if (!params) return true;

    if (params.folder && typeof payload?.path_lower === 'string') {
      if (!payload.path_lower.startsWith(String(params.folder).toLowerCase())) return false;
    }

    if (params.contains && typeof payload?.name === 'string') {
      return payload.name.includes(params.contains);
    }

    return true;
  }
};
