import { newIssueAction } from './actions/new-issue.action';
import { newMergeRequestAction } from './actions/new-merge-request.action';
import { NewIssueHook } from './hooks/new-issue.hook';
import { NewMergeRequestHook } from './hooks/new-merge-request.hook';
import { createIssueReaction } from './reactions/create-issue.reaction';
import { commentMergeRequestReaction } from './reactions/comment-merge-request.reaction';

export function gitlabIntegration(
  gitlabService,
  authRepo,
  engine,
  newIssueHook,
  newMergeRequestHook,
) {
  return {
    id: 'gitlab',
    displayName: 'GitLab',

    instance: {
      gitlabService,
      authRepo,
      engine,
    },

    actions: [
      newIssueAction,
      newMergeRequestAction,
    ],

    reactions: [
      createIssueReaction,
      commentMergeRequestReaction,
    ],

    hooks: [
      newIssueHook,
      newMergeRequestHook,
    ],
  };
}
