export const publishPhotoReaction = {
  id: 'publish_photo',
  name: 'Publish Photo to Instagram',

  execute: async ({ token, params, instagramService }) => {
    if (!token) throw new Error('Instagram account not connected.');

    const { imageUrl, caption } = params;
    if (!imageUrl) throw new Error('Missing imageUrl');

    const container = await instagramService.createMediaContainer(token.userId, {
      imageUrl,
      caption,
    });

    const publish = await instagramService.publishMedia(token.userId, container.id);

    return { success: true, publishedId: publish.id };
  },
};
