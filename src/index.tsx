import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { AuthenticateComponent } from './../src/Components/login/AuthenticateComponent'
import { ExplorerComponent } from './../src/Components/explorer/Explorer'

ReactDOM.render(
  <div>
  <AuthenticateComponent />
  <ExplorerComponent />
  </div>

  , document.getElementById('root'));
