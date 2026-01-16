export const newMergeRequestAction = {
  id: 'new_merge_request',
  name: 'New Merge Request Created',
  displayName: 'New Merge Request',
  description: 'Triggers when a new merge request is opened.',
  input: [
    {
      key: 'projectId',
      label: 'Project / repository',
      type: 'string',
      required: true,
      placeholder: 'group/project',
      helpText: 'Project to watch for new merge requests.',
    },
    {
      key: 'targetBranch',
      label: 'Target branch (optional)',
      type: 'string',
      required: false,
      placeholder: 'main',
      helpText: 'Only trigger for MRs targeting this branch.',
    },
  ],

  match: (payload, params) => {
    if (!params) return true;

    if (params.projectId && Number(payload?.project_id) !== Number(params.projectId)) {
      return false;
    }

    if (params.targetBranch && typeof payload?.target_branch === 'string') {
      if (payload.target_branch !== params.targetBranch) return false;
    }

    if (params.contains && typeof payload?.title === 'string') {
      return payload.title.includes(params.contains);
    }

    return true;
  },
};
