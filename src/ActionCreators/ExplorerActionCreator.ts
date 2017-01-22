import { DropBoxRestClient } from "./../RestClient/DropBoxRestClient";
import { ICloudStorageRestClient } from "./../RestClient/ICloudStorageRestClient";
import { ActionsHub, FolderContent } from './../ActionCreators/ActionsHub';
import { StoresHub } from './../Stores/StoresHub';
import * as Q from 'q';

export class ExplorerActionCreator {
    private _cloudStorageRestClient: ICloudStorageRestClient;

    private _getCloudStorageRestClient() : ICloudStorageRestClient {
        if (!this._cloudStorageRestClient) {
            this._cloudStorageRestClient = new DropBoxRestClient();
        }

        return this._cloudStorageRestClient;
    }

    private _invokeFolderSelectionChangedAction(folder: FolderContent) {
        let actions = ActionsHub.getInstance().getActions();
        actions.folderSelectionChangedAction(folder);

        if (!folder.isExpanded) {
            folder.isExpanded = true;
            actions.folderExpandedAction(folder);
        }
    }

    public toggleExpandCollapseState(folderItem: FolderContent) {
        if (!folderItem.isExpanded) {
            // state changed from collapsed to expanded.
            let cachedFolderContent: FolderContent = StoresHub.getInstance().getExplorerStore().getFolderContentsFromCache(folderItem.path_lower);
            if (cachedFolderContent.shouldFetchChildren) {
                // raise an action that indicates folder expanded.
                let restClient = this._getCloudStorageRestClient();
                restClient.getFolderContents(folderItem).then(
                    (folderContent: FolderContent) => {
                        folderContent.isExpanded = true;
                        let actions = ActionsHub.getInstance().getActions();
                        actions.folderExpandedAction(folderContent);
                    }
                );
            }
            else {
                folderItem.isExpanded = true;
                let actions = ActionsHub.getInstance().getActions();
                actions.folderExpandedAction(folderItem);
            }
        }
        else {
            // raise an action that indicates folder collapsed.
            folderItem.isExpanded = false;
            let actions = ActionsHub.getInstance().getActions();
            actions.folderCollapsedAction(folderItem);
        }
    }

    public selectFolder(folderItem: FolderContent) : void {
        if (!folderItem || !folderItem.isFolder) {
            return;
        }

        if (folderItem.shouldFetchChildren) {
            let restClient = this._getCloudStorageRestClient();
            let promise: Q.Promise<FolderContent> = restClient.getFolderContents(folderItem);
            promise.then(
                (folderContent: FolderContent) => {
                    this._invokeFolderSelectionChangedAction(folderContent);
                },
                (error: Error) => {
                    console.log(error.message);
                }
            );
        }
        else {
            this._invokeFolderSelectionChangedAction(folderItem);
        }
    }
}