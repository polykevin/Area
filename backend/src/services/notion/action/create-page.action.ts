import { ActionDefinition } from '../../abstract/service.interface';

export const NotionCreatePageAction: ActionDefinition<any, any> = {
  id: 'notion.create_page',
  name: 'Create page',
  match: () => true,
};
