import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService';
import { ApplicationPaths } from './Constants';

export class Home extends Component
{
  static displayName = Home.name;

  constructor(props)
  {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
      role: null
    };
  }

  componentDidMount()
  {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount()
  {
    authService.unsubscribe(this._subscription);
  }

  async populateState()
  {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user && user.name,
      role: user && user.role
    });
  }

  render()
  {
    return (
      <div>
        <h1>Play Economy</h1>
        <p>Welcome to the Play Economy website, a cloud native virtual economy system.</p>
        <p>To get started, yout can:</p>
        <ul>
          <li>Visit the <Link to={ApplicationPaths.StorePath}>Store</Link></li>
          <li>Check your <Link to={ApplicationPaths.InventoryPath}>Inventory</Link></li>
          {this.adminView()}
        </ul>
        <p>You can also</p>
        <ul>
          <li>Manage the <a href={window.RABBITMQ_URL} target="_blank" rel="noreferrer">message queues</a></li>
          <li>Explore the Open API documentation:
            <ul>
              <li><a href={`${window.CATALOG_SERVICE_URL}/swagger`} target="_blank" rel="noreferrer">Catalog service</a></li>
              <li><a href={`${window.INVENTORY_SERVICE_URL}/swagger`} target="_blank" rel="noreferrer">Inventory service</a></li>
              <li><a href={`${window.IDENTITY_SERVICE_URL}/swagger`} target="_blank" rel="noreferrer">Identity service</a></li>
              <li><a href={`${window.TRADING_SERVICE_URL}/swagger`} target="_blank" rel="noreferrer">Trading service</a></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }

  adminView()
  {
    if (this.state.isAuthenticated && this.state.role === "Admin")
    {
      return (<Fragment>
        <li>Manage the <Link to={ApplicationPaths.CatalogPath}>Catalog</Link></li>
        <li>Manage registered <Link to={ApplicationPaths.UsersPath}>Users</Link></li>
      </Fragment>);
    }
  }
}
