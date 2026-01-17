export const newMediaAction = {
  id: 'new_media',
  name: 'New Instagram Post/Reel',
  displayName: 'New Media Uploaded',
  description: 'Triggers when new media is uploaded.',
  input: [
    {
      key: 'media_type',
      label: 'Media type (optional)',
      type: 'string',
      required: false,
      placeholder: 'image',
      helpText: 'Filter by media type (e.g., image, video) if supported.',
    },
  ],
  match: (payload, params) => {
    if (!params) return true;
    if (params.media_type && payload.media_type !== params.media_type) return false;
    return true;
  },
};
