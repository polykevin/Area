export const newIssueAction = {
  id: 'new_issue',
  name: 'New Issue Created',

  match: (payload, params) => {
    if (!params) return true;

    if (params.author && payload.user?.login !== params.author) {
      return false;
    }

    if (params.label) {
      const labels = payload.labels?.map(l => l.name) ?? [];
      if (!labels.includes(params.label)) return false;
    }

    return true;
  },
};
