export const newIssueAction = {
  id: 'new_issue',
  name: 'new.github.issue',
  displayName: 'New GitHub Issue',
  description: 'Triggers when a new issue is created in a repository',

  input: [
    {
      key: 'author',
      label: 'Author',
      type: 'string',
      required: false,
      placeholder: 'octocat',
      helpText: 'Only trigger for issues created by this user',
    },
    {
      key: 'label',
      label: 'Label',
      type: 'string',
      required: false,
      placeholder: 'bug',
      helpText: 'Only trigger for issues with this label',
    },
  ],

  match: (payload, params) => {
    if (!params) return true;

    if (params.author && payload.user?.login !== params.author) {
      return false;
    }

    if (params.label) {
      const labels = payload.labels?.map((l) => l.name) ?? [];
      if (!labels.includes(params.label)) return false;
    }

    return true;
  },
};
