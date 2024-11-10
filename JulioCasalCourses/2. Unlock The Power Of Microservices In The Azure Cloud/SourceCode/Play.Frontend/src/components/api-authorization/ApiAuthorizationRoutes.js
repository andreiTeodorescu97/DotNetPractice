import React, { Component, Fragment } from 'react';
import { Route } from 'react-router';
import { Login } from './Login'
import { Logout } from './Logout'
import { AuthorizationPaths, LoginActions, LogoutActions } from './ApiAuthorizationConstants';

export default class ApiAuthorizationRoutes extends Component {

  render () {
    return(
      <Fragment>
          <Route path={AuthorizationPaths.Login} render={() => loginAction(LoginActions.Login)} />
          <Route path={AuthorizationPaths.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)} />
          <Route path={AuthorizationPaths.LoginCallback} render={() => loginAction(LoginActions.LoginCallback)} />
          <Route path={AuthorizationPaths.Profile} render={() => loginAction(LoginActions.Profile)} />
          <Route path={AuthorizationPaths.Register} render={() => loginAction(LoginActions.Register)} />
          <Route path={AuthorizationPaths.LogOut} render={() => logoutAction(LogoutActions.Logout)} />
          <Route path={AuthorizationPaths.LogOutCallback} render={() => logoutAction(LogoutActions.LogoutCallback)} />
          <Route path={AuthorizationPaths.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)} />
      </Fragment>);
  }
}

function loginAction(name){
    return (<Login action={name}></Login>);
}

function logoutAction(name) {
    return (<Logout action={name}></Logout>);
}
