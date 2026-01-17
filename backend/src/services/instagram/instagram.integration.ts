import { newMediaAction } from './actions/new-media.action';
import { NewMediaHook } from './hooks/new-media.hook';

export function instagramIntegration(instagramService, authRepo, engine, newMediaHook) {
  return {
    id: 'instagram',
    displayName: 'Instagram',

    instance: {
      instagramService,
      authRepo,
      engine,
    },

    actions: [newMediaAction],

    reactions: [],

    hooks: [newMediaHook],
  };
}
