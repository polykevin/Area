export interface GitLabIssue {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
  web_url?: string;
  author?: { id: number; username?: string; name?: string };
}

export interface GitLabMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
  web_url?: string;
  author?: { id: number; username?: string; name?: string };
  source_branch?: string;
  target_branch?: string;
}
