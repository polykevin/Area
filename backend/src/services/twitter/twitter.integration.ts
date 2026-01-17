import { newTweetAction } from './actions/new-tweet.action';
import { newMentionAction } from './actions/new-mention.action';
import { NewTweetHook } from './hooks/new-tweet.hook';
import { NewMentionHook } from './hooks/new-mention.hook';
import { postTweetReaction } from './reactions/post-tweet.reaction';

export function twitterIntegration(twitterService, authRepo, engine, newTweetHook, newMentionHook) {
  return {
    id: 'twitter',
    displayName: 'Twitter',
    color: '#1DA1F2',
    iconKey: 'twitter',

    instance: {
      twitterService,
      authRepo,
      engine,
    },

    actions: [
      newTweetAction,
      newMentionAction,
    ],

    reactions: [
      postTweetReaction,
    ],

    hooks: [
      newTweetHook,
      newMentionHook,
    ]
  };
}
