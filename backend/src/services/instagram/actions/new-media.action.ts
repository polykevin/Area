export const newMediaAction = {
  id: 'new_media',
  name: 'New Instagram Post/Reel',
  displayName: 'New Media Uploaded',
  description: 'Triggers when new media is uploaded.'
  match: (payload, params) => {
    if (!params) return true;
    if (params.media_type && payload.media_type !== params.media_type) return false;
    return true;
  },
};
