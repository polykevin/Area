export const newIssueAction = {
  id: 'new_issue',
  name: 'New Issue Created',

  match: (payload, params) => {
    if (!params) return true;

    //optional filter: projectId
    if (params.projectId && Number(payload?.project_id) !== Number(params.projectId)) {
      return false;
    }

    //optional filter: contains in title
    if (params.contains && typeof payload?.title === 'string') {
      return payload.title.includes(params.contains);
    }

    return true;
  },
};
