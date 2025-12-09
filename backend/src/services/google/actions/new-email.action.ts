interface NewEmailPayload {
  from?: string;
  [key: string]: unknown;
}

interface NewEmailParams {
  from?: string;
}

export const newEmailAction = {
  id: 'new_email',
  name: 'New Email Received',
  match: (payload: NewEmailPayload, params?: NewEmailParams) => {
    if (!params) return true;
    if (params.from && payload.from !== params.from) return false;
    return true;
  },
};
