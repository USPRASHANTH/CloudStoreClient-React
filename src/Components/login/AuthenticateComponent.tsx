import * as React from 'react';
import { AuthenticateActionCreator } from './../../ActionCreators/AuthenticateActionCreator'

interface AuthenticateComponentProps extends React.Props<AuthenticateComponent> {
}

export class AuthenticateComponent extends React.Component<AuthenticateComponentProps, {}> {
   private _authenticateActionCreator: AuthenticateActionCreator = new AuthenticateActionCreator();

   public render() {
       return (
          <button className={"login-button"} onClick={()=>{this.authenticate();}}>
          Login to Dropbox
          </button>
       );
  }

  private authenticate() {
       // Assume that the user logs in using Dropbox credentials.
       // Invoke actionCreator.getInitialDropBoxData() to do initial setup.
       // Use hard coded access token.
       this._authenticateActionCreator.getInitialDropBoxData();
       $(".login-button").addClass("hidden");
       $(".explorer-view.hidden").removeClass("hidden");
  }
}
