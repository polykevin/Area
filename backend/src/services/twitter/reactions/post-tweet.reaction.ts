export const postTweetReaction = {
  id: 'post_tweet',
  name: 'Post a Tweet',
  displayName: 'Post Tweet',
  description: 'Publishes a new tweet to your account.',
  input: [
    {
      key: 'text',
      label: 'Tweet text',
      type: 'string',
      required: true,
      placeholder: 'Hello Twitter!',
      helpText: 'Text to publish.',
    },
  ],

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
