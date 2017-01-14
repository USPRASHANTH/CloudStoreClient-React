import { DropBoxRestClient } from "./../RestClient/DropBoxRestClient";
import { ICloudStorageRestClient } from "./../RestClient/ICloudStorageRestClient";
import { ActionsHub, FolderContent } from './../ActionCreators/ActionsHub'

export class AuthenticateActionCreator {
    private _cloudStorageRestClient: ICloudStorageRestClient;

    private getCloudStorageRestClient() : ICloudStorageRestClient {
        if (!this._cloudStorageRestClient) {
            this._cloudStorageRestClient = new DropBoxRestClient();
        }

        return this._cloudStorageRestClient;
    }

    public getInitialDropBoxData() : void {
        let restClient = this.getCloudStorageRestClient();
        restClient.getFolderContents("/").then(
            (folderContent: FolderContent) => {
                // Invoke folder contents changed action with path of folder opened and contents of the folder.
                // It will result in Explorer store emitting the change and that will cause the Explorer Component update itself.
                let actions = ActionsHub.getInstance().getActions();
                actions.folderContentsChangedAction(folderContent);
            }
        );
    }
    
    public getInitialOneDriveData() : void {
    }
}