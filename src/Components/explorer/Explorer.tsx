import * as React from 'react';
import * as Reflux from 'reflux'
import { ExplorerStore, ExplorerState } from './../../Stores/ExplorerStore';
import { StoresHub } from './../../Stores/StoresHub';
import { ActionsHub, FolderContent } from './../../ActionCreators/ActionsHub';
import { ExplorerActionCreator } from './../../ActionCreators/ExplorerActionCreator';

export var ExplorerComponent = React.createClass({
    mixins: [Reflux.listenTo(StoresHub.getInstance().getExplorerStore().getStore(),"onStoreChanged")],
    getInitialState: function() {
        return StoresHub.getInstance().getExplorerStore().getState();
    },
    onStoreChanged: function(explorerState: ExplorerState) {
        this.setState(explorerState);
    },
    onNavigate: function() {
        let path: string = $(".input-path").val();
        ActionsHub.getInstance().getExplorerActionCreator().changeRootFolder(path);
    },
    render: function() {
       return (
           <div>
           {this.state.rootFolder.path_display}
           <br/>
           Path : <input type="text" className="input-path" />
           <br/>
           <input type="button" value="Navigate" onClick={this.onNavigate} />
           </div>
       );
    },
});