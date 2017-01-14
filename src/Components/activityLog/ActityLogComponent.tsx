import * as React from 'react';

interface ActivityLogComponentProps extends React.Props<ActivityLogComponent> {
    path: string;
    isFolder: boolean;
}

interface ActivityLogState {
    folderContents: FolderContent[];
}

export class FolderContent {
    name: string;
    path_display: string;
    path_lower: string;
    isFolder: boolean;
    isExpanded: boolean;
    revision: string;
}

export default class ActivityLogComponent extends React.Component<ActivityLogComponent, ActivityLogState> {

   public render() {
       return (
           <div/>
       );
  }
}