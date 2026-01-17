export const createIssueReaction = {
  id: 'create_issue',
  name: 'Create GitHub Issue',

  execute: async ({ token, params, githubService }) => {
    if (!token) {
      throw new Error('GitHub account not connected.');
    }

    const { owner, repo, title, body } = params;

    if (!owner || !repo || !title) {
      throw new Error('Missing required parameters');
    }

    await githubService.createIssue(
      token.userId,
      owner,
      repo,
      title,
      body,
    );

    return { success: true };
  },
};
