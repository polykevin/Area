export const createIssueReaction = {
  id: 'create_issue',
  name: 'Create an Issue',
  displayName: 'Create Issue',
  description: 'Creates a new issue in the selected repository.'

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
