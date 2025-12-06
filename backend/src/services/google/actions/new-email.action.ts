export const newEmailAction = {
  id: 'new_email',
  name: 'New Email Received',
  match: (payload, params) => {
    if (params.from && !payload.from.includes(params.from)) return false;
    if (params.subject && !payload.subject.includes(params.subject)) return false;
    return true;
  }
};
