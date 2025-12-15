export const newEmailAction = {
  id: 'new_email',
  name: 'New Email Received',
  match: (payload, params) => {
    if (!params) return true;
    if (params.from && payload.from !== params.from) return false;
    return true;
  }
};
