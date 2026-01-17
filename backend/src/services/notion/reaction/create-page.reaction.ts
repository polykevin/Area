export const NotionCreatePageReaction = {
  id: 'create_page',
  name: 'Create Notion page',
  displayName: 'Create Notion page',
  description: 'Create a new Notion page',

  input: [
    {
      key: 'databaseId',
      label: 'Database ID',
      type: 'string',
      required: true,
      placeholder: '2e99859422a18036963dc0cdfd378f5b',
      helpText: 'ID of the Notion database where the page will be created.',
    },
    {
      key: 'title',
      label: 'Page title',
      type: 'string',
      required: true,
      placeholder: 'New page from AREA',
      helpText: 'Title of the Notion page.',
    },
    {
      key: 'content',
      label: 'Content (optional)',
      type: 'string',
      required: false,
      placeholder: 'Page content...',
      helpText: 'Optional page content.',
    },
  ],

  async execute({ notionService, params, context }) {
    const databaseId =
      params?.databaseId ?? '2e99859422a18036963dc0cdfd378f5b';

    const { to, subject, text } = params ?? {};

    const title = subject ?? 'Email Sent';
    const content = `Email sent to : ${to}\n\n${text ?? ''}`;

    return notionService.createPage(
      context.userId,
      databaseId,
      title,
      content
    );
  },
};
