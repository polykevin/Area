export const createIssueReaction = {
  id: 'create_issue',
  name: 'Create GitHub Issue',

  execute: async ({ token, params, githubService }) => {
    const { owner, repo, title, body } = params;

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
