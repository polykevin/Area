import { Logger } from '@nestjs/common';

const logger = new Logger('CreateSharedLinkReaction');

export const createSharedLinkReaction = {
  id: 'create_shared_link',
  name: 'Create a Shared Link',

  execute: async ({ token, params, dropboxService }) => {
    if (!token) {
      throw new Error('Dropbox account not connected.');
    }

    const { path } = params;
    if (!path) throw new Error('Missing "path"');

    const res = await dropboxService.createSharedLink(token.userId, path);

    const url = res?.url ?? null;

    logger.log(
      `create_shared_link userId=${token.userId} path=${path} url=${url ?? 'none'} ${
        res?.alreadyExisted ? '(already existed)' : ''
      }`,
    );

    return {
      success: true,
      url,
      alreadyExisted: !!res?.alreadyExisted,
    };
  },
};
