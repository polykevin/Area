export interface DropboxFile {
  id: string;
  name: string;
  path_lower?: string;
  server_modified?: string;
  size?: number;
  '.tag'?: string;
}
