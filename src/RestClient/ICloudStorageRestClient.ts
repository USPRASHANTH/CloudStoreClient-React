import { Promise } from 'q';
import { FolderContent } from "./../ActionCreators/ActionsHub"

export interface ICloudStorageRestClient {
  uploadFile(path: string): void;
  getFolderContents(folder: FolderContent): Promise<FolderContent>;
}