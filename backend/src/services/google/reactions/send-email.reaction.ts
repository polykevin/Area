import { buildRawEmail } from '../utils/build-raw-email';
import { GoogleService } from '../google.service';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

interface GoogleToken {
  userId: number;
  metadata?: ({ email?: string } & Record<string, unknown>) | null;
}

export const sendEmailReaction = {
  id: 'send_email',
  name: 'Send an Email via Gmail',

  execute: async ({
    token,
    params,
    googleService,
  }: {
    token: GoogleToken | null;
    params: SendEmailParams;
    googleService: GoogleService;
  }) => {
    if (!token) {
      throw new Error('Google account not connected.');
    }

    const { to, subject, text } = params;

    const senderEmail = token.metadata?.email ?? 'me';

    const rawMessage = buildRawEmail({
      from: senderEmail,
      to,
      subject,
      text,
    });

    await googleService.sendEmail(token.userId, rawMessage);

    return { success: true };
  },
};
