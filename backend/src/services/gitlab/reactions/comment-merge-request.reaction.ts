export const commentMergeRequestReaction = {
  id: 'comment_merge_request',
  name: 'Comment on a Merge Request',
  displayName: 'Comment on Merge Request',
  description: 'Adds a comment to an existing merge request.',

  input: [
    {
      key: 'projectId',
      label: 'Project ID',
      type: 'string',
      required: true,
      placeholder: '123456',
    },
    {
      key: 'mergeRequestIid',
      label: 'Merge request IID',
      type: 'string',
      required: true,
      placeholder: '42',
    },
    {
      key: 'body',
      label: 'Comment',
      type: 'string',
      required: true,
      placeholder: 'LGTM',
    },
  ],

  async execute({ token, params, gitlabService }) {
    if (!token) {
      throw new Error('GitLab account not connected.');
    }

    const projectId = Number(params.projectId);
    const mergeRequestIid = Number(params.mergeRequestIid);
    const body = String(params.body);

    if (Number.isNaN(projectId)) {
      throw new Error('projectId must be a number');
    }
    if (Number.isNaN(mergeRequestIid)) {
      throw new Error('mergeRequestIid must be a number');
    }
    if (!body) {
      throw new Error('Missing comment body');
    }

    await gitlabService.commentOnMergeRequest(
      token.userId,
      projectId,
      mergeRequestIid,
      body,
    );

    return { success: true };
  },
};
