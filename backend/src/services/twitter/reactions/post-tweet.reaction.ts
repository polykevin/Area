export const postTweetReaction = {
  id: 'post_tweet',
  name: 'Post a Tweet',

  execute: async ({ token, params, twitterService }) => {
    if (!token) {
      throw new Error('Twitter account not connected.');
    }

    const { text } = params;
    if (!text) throw new Error('Missing "text"');

    await twitterService.postTweet(token.userId, text);

    return { success: true };
  },
};
