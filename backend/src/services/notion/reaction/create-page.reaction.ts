export const NotionCreatePageReaction = {
  id: 'create_page',
  name: 'Create Notion page',
  displayName: 'Create Notion page',
  description: 'Create a new Notion page',

  input: [
    {
      key: 'databaseId',
      label: 'Database ID (optional)',
      type: 'string',
      required: false,
      placeholder: '2e99859422a18036963dc0cdfd378f5b',
      helpText: 'Target Notion database. If empty, a default database is used.',
    },
    {
      key: 'to',
      label: 'To',
      type: 'string',
      required: false,
      placeholder: 'user@example.com',
      helpText: 'Used only to build the page content (email recap).',
    },
    {
      key: 'subject',
      label: 'Subject',
      type: 'string',
      required: false,
      placeholder: 'Email Sent',
      helpText: 'Used as the Notion page title.',
    },
    {
      key: 'text',
      label: 'Body',
      type: 'string',
      required: false,
      placeholder: 'Message content...',
      helpText: 'Used to build the Notion page content.',
    },
  ],

  async execute({ token, notionService, params }) {
    const databaseId =
      params?.databaseId ?? '2e99859422a18036963dc0cdfd378f5b';

    const { to, subject, text } = params ?? {};

    const title = subject ?? 'Email Sent';
    const content = `Email sent to : ${to}\n\n${text ?? ''}`;

    return notionService.createPage(databaseId, title, content);
  },
};
