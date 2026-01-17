import { ActionDefinition } from '../../abstract/service.interface';

export const NotionCreatePageAction: ActionDefinition<any, any> = {
  id: 'notion.create_page',
  name: 'create.page',
  displayName: 'Create page',
  description: 'Create a new page',
  match: () => true,
};
