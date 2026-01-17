import { newFileAction } from './actions/new-file.action';
import { fileChangedAction } from './actions/file-changed.action';
import { NewFileHook } from './hooks/new-file.hook';
import { FileChangedHook } from './hooks/file-changed.hook';
import { uploadTextFileReaction } from './reactions/upload-text-file.reaction';
import { createSharedLinkReaction } from './reactions/create-shared-link.reaction';

export function dropboxIntegration(dropboxService, authRepo, engine, newFileHook, fileChangedHook) {
  return {
    id: 'dropbox',
    displayName: 'Dropbox',
    color: '#0061FF',
    iconKey: 'dropbox',

    instance: {
      dropboxService,
      authRepo,
      engine,
    },

    actions: [
      newFileAction,
      fileChangedAction,
    ],

    reactions: [
      uploadTextFileReaction,
      createSharedLinkReaction,
    ],

    hooks: [
      newFileHook,
      fileChangedHook,
    ]
  };
}
