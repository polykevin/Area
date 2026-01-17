export const NotionCreatePageReaction = {
  id: 'create_page',
  name: 'Create Notion page',

  async execute({ notionService, params }) {
    const databaseId =
      params?.databaseId ?? '2e99859422a18036963dc0cdfd378f5b';

    const { to, subject, text } = params;

    const title = subject ?? 'Email Sent';
    const content = `Email sent to : ${to}\n\n${text ?? ''}`;

    // console.log('[NOTION] Creating page for sent email');

    return notionService.createPage(databaseId, title, content);
  },
};
