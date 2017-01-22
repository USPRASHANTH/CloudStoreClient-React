import * as React from 'react';
import * as Reflux from 'reflux';

import { ExplorerStore, ExplorerState } from './../../Stores/ExplorerStore';
import { StoresHub } from './../../Stores/StoresHub';
import { ChangeType } from './../../ActionCreators/ActionsHub';
import { TreeView } from './../treeview/TreeView';
import { ListView } from './../listview/ListView';

export var PathComponent = React.createClass({
    mixins: [Reflux.listenTo(StoresHub.getInstance().getExplorerStore().getStore(),"onStoreChanged")],
    getInitialState: function() {
      return StoresHub.getInstance().getExplorerStore().getState();
    },
    onStoreChanged: function(explorerState: ExplorerState) {
      this.setState(explorerState);
    },
    render: function() {
        return (
            <div className={"path-component"}>
            Selected Folder Path : {this.state.selectedFolder.path_display}
            </div>
        );
    }
});

export var ExplorerComponent = React.createClass({
    render: function() {
        return (
           <div className={"explorer-view hidden"}>
           <PathComponent />
           <div className="explorer-left-pane">
           <TreeView rootFolder={null} selectedFolder={null} changedFolder={null} changeType={ChangeType.Unknown} />
           </div>
           <div className="explorer-right-pane">
           <ListView rootFolder={null} selectedFolder={null} changedFolder={null} changeType={ChangeType.Unknown} />
           </div>
           </div>
        );
    },
});