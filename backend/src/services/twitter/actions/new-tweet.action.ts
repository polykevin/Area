export const newTweetAction = {
  id: 'new_tweet',
  name: 'New Tweet Posted',

  match: (payload, params) => {
    if (!params) return true;

    //optional filter: contains
    if (params.contains && typeof payload?.text === 'string') {
      return payload.text.includes(params.contains);
    }

    return true;
  }
};
