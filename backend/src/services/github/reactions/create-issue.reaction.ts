export const createIssueReaction = {
  id: 'create_issue',
  name: 'create.github.issue',
  displayName: 'Create GitHub Issue',
  description: 'Create a new GitHub issue',

  input: [
    {
      key: 'owner',
      label: 'Repository Owner',
      type: 'string',
      required: true,
      placeholder: 'octocat',
      helpText: 'GitHub username or organization',
    },
    {
      key: 'repo',
      label: 'Repository Name',
      type: 'string',
      required: true,
      placeholder: 'my-repo',
      helpText: 'Target repository name',
    },
    {
      key: 'title',
      label: 'Issue Title',
      type: 'string',
      required: true,
      placeholder: 'Bug: login fails',
      helpText: 'Title of the issue',
    },
    {
      key: 'body',
      label: 'Issue Description',
      type: 'string',
      required: false,
      placeholder: 'Steps to reproduce...',
      helpText: 'Optional issue description',
    },
  ],

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
