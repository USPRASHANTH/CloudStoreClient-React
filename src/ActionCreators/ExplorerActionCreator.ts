import { DropBoxRestClient } from "./../RestClient/DropBoxRestClient";
import { ICloudStorageRestClient } from "./../RestClient/ICloudStorageRestClient";
import { ActionsHub, FolderContent } from './../ActionCreators/ActionsHub';
import * as Q from 'q';

export class ExplorerActionCreator {
    private _cloudStorageRestClient: ICloudStorageRestClient;

    private getCloudStorageRestClient() : ICloudStorageRestClient {
        if (!this._cloudStorageRestClient) {
            this._cloudStorageRestClient = new DropBoxRestClient();
        }

        return this._cloudStorageRestClient;
    }

    public changeRootFolder(path: string) : void {
        let restClient = this.getCloudStorageRestClient();
        let promise: Q.Promise<FolderContent> = restClient.getFolderContents(path);
        console.log("Before promise has been fulfilled...");
        promise.then(
            (folderContent: FolderContent) => {
                // Invoke root folder changed action with path of folder opened and contents of the folder.
                // It will result in Explorer store emitting the change and that will cause the Explorer Component to re-render.
                console.log("Inside promise.then()...");
                let actions = ActionsHub.getInstance().getActions();
                actions.rootFolderChangedAction(folderContent);
            },
            (error: Error) => {
                console.log(error.message);
            }
        );
    }
}