export const commentMergeRequestReaction = {
  id: 'comment_merge_request',
  name: 'Comment on a Merge Request',

  execute: async ({ token, params, gitlabService }) => {
    if (!token) {
      throw new Error('GitLab account not connected.');
    }

    const { projectId, mergeRequestIid, body } = params;

    if (!projectId) throw new Error('Missing "projectId"');
    if (!mergeRequestIid) throw new Error('Missing "mergeRequestIid"');
    if (!body) throw new Error('Missing "body"');

    await gitlabService.commentOnMergeRequest(
      token.userId,
      Number(projectId),
      Number(mergeRequestIid),
      String(body),
    );

    return { success: true };
  },
};
