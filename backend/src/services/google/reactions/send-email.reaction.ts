import { buildRawEmail } from '../utils/build-raw-email';

export const sendEmailReaction = {
  id: "send_email",
  name: "Send an Email via Gmail",

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

    console.log("gg", token);
    await googleService.sendEmail(token.userId, rawMessage);

    return { success: true };
  },
};
