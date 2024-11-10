import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Catalog } from './components/Catalog';
import { Inventory } from './components/Inventory';
import { Users } from './components/Users';
import { Store } from './components/Store';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { AuthorizationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { ApplicationPaths } from './components/Constants';

import './App.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <AuthorizeRoute path={ApplicationPaths.CatalogPath} component={Catalog} />
        <AuthorizeRoute path={ApplicationPaths.InventoryPath} component={Inventory} />
        <AuthorizeRoute path={ApplicationPaths.UsersPath} component={Users} />
        <AuthorizeRoute path={ApplicationPaths.StorePath} component={Store} />
        <Route path={AuthorizationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
