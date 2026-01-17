export const newIssueAction = {
  id: 'new_issue',
  name: 'New Issue Created',
  displayName: 'New Issue Created',
  description: 'Triggers when a new issue is created in the repository.',
  input: [
      {
        key: 'projectId',
        label: 'Project ID',
        type: 'string',
        required: false,
        placeholder: '123456',
        helpText: 'Only trigger for issues in this GitLab project.',
      },
      {
        key: 'contains',
        label: 'Title contains (optional)',
        type: 'string',
        required: false,
        placeholder: 'bug',
        helpText: 'Only trigger if the issue title contains this text.',
      },
  ],

  match: (payload, params) => {
    if (!params) return true;

    //optional filter: projectId
    if (params.projectId && Number(payload?.project_id) !== Number(params.projectId)) {
      return false;
    }

    //optional filter: contains in title
    if (params.contains && typeof payload?.title === 'string') {
      return payload.title.includes(params.contains);
    }

    return true;
  },
};
