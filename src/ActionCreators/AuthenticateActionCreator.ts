import { DropBoxRestClient } from "./../RestClient/DropBoxRestClient";
import { ICloudStorageRestClient } from "./../RestClient/ICloudStorageRestClient";
import { ActionsHub, FolderContent } from './../ActionCreators/ActionsHub'
import { StoresHub } from './../Stores/StoresHub';

export class AuthenticateActionCreator {
    private _cloudStorageRestClient: ICloudStorageRestClient;

    private getCloudStorageRestClient() : ICloudStorageRestClient {
        if (!this._cloudStorageRestClient) {
            this._cloudStorageRestClient = new DropBoxRestClient();
        }

        return this._cloudStorageRestClient;
    }

    public getInitialDropBoxData() : void {
        let rootFolder: FolderContent = StoresHub.getInstance().getExplorerStore().getState().rootFolder;
        let restClient = this.getCloudStorageRestClient();
        restClient.getFolderContents(rootFolder).then(
            (folderContent: FolderContent) => {
                let actions = ActionsHub.getInstance().getActions();

                // Raise folderContentsChangedAction since we have fetched the root folder contents. 
                // Raise folderSelectionChangedAction to select the root folder.
                // Raise folderExpandedAction to expand the root folder.
                actions.folderContentsChangedAction(folderContent);
                actions.folderSelectionChangedAction(folderContent);
                actions.folderExpandedAction(folderContent);
            }
        );
    }
    
    public getInitialOneDriveData() : void {
    }
}