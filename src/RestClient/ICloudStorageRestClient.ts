import { Promise } from 'q';
import { FolderContent } from "./../ActionCreators/ActionsHub"

export interface ICloudStorageRestClient {
  uploadFile(path: string): void;
  getFolderContents(path: string): Promise<FolderContent>;
}