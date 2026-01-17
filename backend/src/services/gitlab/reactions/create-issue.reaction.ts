export const createIssueReaction = {
  id: 'create_issue',
  name: 'Create an Issue',
  displayName: 'Create Issue',
  description: 'Creates a new issue in the selected repository.',
  input: [
      {
        key: 'projectId',
        label: 'Project ID',
        type: 'string',
        required: true,
        placeholder: '123456',
        helpText: 'GitLab project ID where the issue will be created.',
      },
      {
        key: 'title',
        label: 'Title',
        type: 'string',
        required: true,
        placeholder: 'Bug: app crashes on start',
        helpText: 'Issue title.',
      },
      {
        key: 'description',
        label: 'Description (optional)',
        type: 'string',
        required: false,
        placeholder: 'Steps to reproduce...',
        helpText: 'Issue description.',
      },
  ],

  execute: async ({ token, params, gitlabService }) => {
    if (!token) {
      throw new Error('GitLab account not connected.');
    }

    const { projectId, title, description } = params;

    if (!projectId) throw new Error('Missing "projectId"');
    if (!title) throw new Error('Missing "title"');

    await gitlabService.createIssue(
      token.userId,
      Number(projectId),
      String(title),
      description !== undefined && description !== null ? String(description) : undefined,
    );

    return { success: true };
  },
};
