import { newMediaAction } from './actions/new-media.action';
import { NewMediaHook } from './hooks/new-media.hook';
import { publishPhotoReaction } from './reactions/publish-photo.reaction';

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

    reactions: [publishPhotoReaction],

    hooks: [newMediaHook],
  };
}
