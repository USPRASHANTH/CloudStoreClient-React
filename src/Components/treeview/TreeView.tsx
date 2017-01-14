import * as React from 'react';
import { connect } from 'react-redux';

interface TreeViewComponentProps extends React.Props<TreeViewComponent> {
    path: string;
    isFolder: boolean;
}

export default class TreeViewComponent extends React.Component<TreeViewComponentProps, {}> {

   public render() {
       return (
           <div />
       );
  }
}

/*
const mapStateToProps = (state) => {
    return {
      members: state.members
    }
}


const mapDispatchToProps = (dispatch) => {
  return {
    loadMembers: () => {return undefined;}
  }
}

const ContainerMembersPage = connect(
                                   mapStateToProps
                                  ,mapDispatchToProps
                                )(TreeViewComponent)


export default ContainerMembersPage;
*/