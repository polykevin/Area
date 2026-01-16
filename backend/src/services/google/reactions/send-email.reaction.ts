import { buildRawEmail } from '../utils/build-raw-email';

export const sendEmailReaction = {
  id: "send_email",
  name: "Send an Email via Gmail",
  displayName: 'Send Email',
  description: 'Sends an email to the specified recipient.',
  input: [
    {
      key: 'to',
      label: 'To',
      type: 'string',
      required: true,
      placeholder: 'user@example.com',
      helpText: 'Recipient email address.',
    },
    {
      key: 'subject',
      label: 'Subject',
      type: 'string',
      required: true,
      placeholder: 'Hello',
      helpText: 'Email subject.',
    },
    {
      key: 'text',
      label: 'Body',
      type: 'string',
      required: true,
      placeholder: 'Message content...',
      helpText: 'Email body content.',
    },
  ],

  execute: async ({ token, params, event, googleService }) => {
    if (!token) {
      throw new Error("Google account not connected.");
    }

    const { to, subject, text } = params;

    const rawMessage = buildRawEmail({
      from: token.metadata?.email || "me",
      to,
      subject,
      text,
    });

    await googleService.sendEmail(token.userId, rawMessage);

    return { success: true };
  },
};
