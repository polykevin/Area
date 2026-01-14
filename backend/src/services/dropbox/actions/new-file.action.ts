export const newFileAction = {
  id: 'new_file',
  name: 'New File Added',

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
