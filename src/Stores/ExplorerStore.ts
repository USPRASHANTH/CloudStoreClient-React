import * as Reflux from 'reflux';
import { ActionsHub, FolderContent } from './../ActionCreators/ActionsHub';

export interface ExplorerState {
    rootFolder: FolderContent;
}

export class ExplorerStore {
    private _state: ExplorerState;
    private _store: Reflux.Store;
    
    constructor() {

        this._state = {
            rootFolder: {
                name: "/",
                path_display: "/",
                path_lower: "/",
                isFolder: true,
                isExpanded: true,
                revision: undefined,
                children: undefined,
            } as FolderContent,
        };

        let that = this;
        this._store = Reflux.createStore({
            getInitialState: function() {
                return that._state;
            },
            init: function() {
                let actions = ActionsHub.getInstance().getActions();
                this.listenTo(actions.rootFolderChangedAction, this.onRootFolderChangedAction);
                this.listenTo(actions.folderContentsChangedAction, this.onFolderContentsChangedAction);
            },
            onRootFolderChangedAction: function(folderContent: FolderContent) {
                console.log("onRootFolderChangedAction");
                this.trigger({
                    rootFolder: folderContent,
                } as ExplorerState);
            },
            onFolderContentsChangedAction: function(folderContent: FolderContent) {
                console.log("onFolderContentsChangedAction");
                this.trigger({
                    rootFolder: folderContent,
                } as ExplorerState);
            },
        });
    }

    public getState(): ExplorerState {
        return this._state;
    }

    public getStore(): Reflux.Store {
        return this._store;
    }
}