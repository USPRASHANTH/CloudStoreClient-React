import * as Reflux from 'reflux';
import { ActionsHub, FolderContent, ChangeType } from './../ActionCreators/ActionsHub';

export interface ExplorerState {
    rootFolder: FolderContent;
    selectedFolder: FolderContent;
    changedFolder: FolderContent;
    changeType: ChangeType;
}

export class ExplorerStore {
    private _state: ExplorerState;
    private _store: Reflux.Store;

    private _treeCache: { [id: string] : FolderContent } = { };
    
    constructor() {

        let rootFolder = {
                name: "/",
                path_display: "/",
                path_lower: "",
                isFolder: true,
                isExpanded: true,
                shouldFetchChildren: true,
                level: 1,
                revision: undefined,
                children: undefined,
            } as FolderContent;

        this._state = {
            rootFolder: rootFolder,
            selectedFolder: rootFolder,
            changedFolder: rootFolder,
            changeType: ChangeType.Unknown,
        };

        let that = this;
        this._store = Reflux.createStore({
            getInitialState: function() {
                return that._state;
            },
            getState: function() {
                return that._state;
            },
            setState: function(newState: ExplorerState) {
                that._state = newState;
            },
            init: function() {
                let actions = ActionsHub.getInstance().getActions();
                this.listenTo(actions.folderContentsChangedAction, this.onFolderContentsChangedAction);
                this.listenTo(actions.folderSelectionChangedAction, this.onFolderSelectionChangedAction);
                this.listenTo(actions.folderCollapsedAction, this.onFolderCollapsedAction);
                this.listenTo(actions.folderExpandedAction, this.onFolderExpandedAction);
            },
            updateTreeCache: function(folderContent: FolderContent) {
                that._treeCache[folderContent.path_lower] = folderContent;
            },
            onFolderContentsChangedAction: function(folderContent: FolderContent) {
                this.updateTreeCache(folderContent);

                // Add contents of the folder to the cache.
                if (folderContent.children && folderContent.children.length > 0) {
                    folderContent.children.forEach((folderItem: FolderContent) => {
                        folderItem.shouldFetchChildren = true;
                        folderItem.level = folderContent.level + 1;
                        folderItem.isExpanded = false;
                        folderItem.isFolder = (folderItem[".tag"] === "folder");

                        this.updateTreeCache(folderItem);
                    });
                }

                this.setState({
                    rootFolder: this.getState().rootFolder,
                    selectedFolder: folderContent,
                    changedFolder: folderContent,
                    changeType: ChangeType.FolderContentsChanged,
                } as ExplorerState);

                this.trigger(this.getState());
            },
            onFolderSelectionChangedAction: function(folderContent: FolderContent) {
                // No need to update the cache entry
                this.setState({
                    rootFolder: this.getState().rootFolder,
                    selectedFolder: folderContent,
                    changedFolder: folderContent,
                    changeType: ChangeType.FolderSelectionChanged,
                } as ExplorerState);

                this.trigger(this.getState());
            },
            onFolderCollapsedAction: function(folderContent: FolderContent) {
                // Update the cache entry from expand to collapse
                this.updateTreeCache(folderContent);
                this.setState({
                    rootFolder: this.getState().rootFolder,
                    selectedFolder: this.getState().selectedFolder,
                    changedFolder: folderContent,
                    changeType: ChangeType.FolderCollapsed,
                } as ExplorerState);

                this.trigger(this.getState());
            },
            onFolderExpandedAction: function(folderContent: FolderContent) {
                // Update the cache entry from collapse to expand
                this.updateTreeCache(folderContent);
                this.setState({
                    rootFolder: this.getState().rootFolder,
                    selectedFolder: this.getState().selectedFolder,
                    changedFolder: folderContent,
                    changeType: ChangeType.FolderExpanded,
                } as ExplorerState);
                
                this.trigger(this.getState());
            },
        });
    }

    public getFolderContentsFromCache(path: string): FolderContent {
        return this._treeCache[path];
    }

    public getState(): ExplorerState {
        return this._state;
    }

    public getStore(): Reflux.Store {
        return this._store;
    }
}