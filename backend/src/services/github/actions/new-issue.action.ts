export const newIssueAction = {
  id: 'new_issue',
  name: 'New Issue Created',

  async execute({ payload }) {
    return payload;
  },
};
