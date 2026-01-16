export const newTweetAction = {
  id: 'new_tweet',
  name: 'New Tweet Posted',
  displayName: 'New Tweet',
  description: 'Triggers when a new tweet is posted.'

  match: (payload, params) => {
    if (!params) return true;

    //optional filter: contains
    if (params.contains && typeof payload?.text === 'string') {
      return payload.text.includes(params.contains);
    }

    return true;
  }
};
