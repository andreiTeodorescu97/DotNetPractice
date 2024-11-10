import React, { Component } from 'react';
import { Col, Container, Row, Table, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserModal from './form/UserModal';
import inventoryLogo from '../images/inventory-bag.png';
import authService from './api-authorization/AuthorizeService'

export class Users extends Component
{
  static displayName = Users.name;

  constructor(props)
  {
    super(props);
    this.state = { users: [], loading: true, loadedSuccess: false };
  }

  componentDidMount()
  {
    this.populateUsers();
  }

  async populateUsers()
  {
    const token = await authService.getAccessToken();
    fetch(`${window.USERS_API_URL}`, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => this.setState({ users: res, loading: false, loadedSuccess: true }))
      .catch(err =>
      {
        console.log(err);
        this.setState({ users: [], loading: false, loadedSuccess: false })
      });
  }

  updateState = (id) =>
  {
    this.populateUsers();
  }
  deleteUserFromState = id =>
  {
    const updated = this.state.users.filter(user => user.id !== id);
    this.setState({ users: updated })
  }
  async deleteUser(id)
  {
    let confirmDeletion = window.confirm('Do you really wish to delete it?');
    if (confirmDeletion)
    {
      const token = await authService.getAccessToken();
      fetch(`${window.USERS_API_URL}/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res =>
        {
          this.deleteUserFromState(id);
        })
        .catch(err => {          
          console.log(err);
          window.alert("Could not delete the user.");          
        });
    }
  }

  renderUsersTable(users)
  {
    return <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
      <Row>
        <Col>
          <Table striped>
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Email</th>
                <th>Gil</th>
                <th>Inventory</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users || users.length <= 0 ?
                <tr>
                  <td colSpan="6" align="center"><b>No Users yet</b></td>
                </tr>
                : users.map(user => (
                  <tr key={user.id}>
                    <td>
                      {user.id}
                    </td>                    
                    <td>
                      {user.email}
                    </td>
                    <td>
                      {user.gil}
                    </td>
                    <td>
                      <Link to={{
                        pathname: '/inventory',
                        user: user
                      }} >
                        <Image src={inventoryLogo} height={35} />
                      </Link>
                    </td>
                    <td align="center">
                      <div>
                        <UserModal
                          user={user}
                          updateUserIntoState={this.updateState} />
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>;
  }

  render()
  {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.state.loadedSuccess
        ? this.renderUsersTable(this.state.users)
        : <p>Could not load users</p>;

    return (
      <div>
        <h1 id="tabelLabel" >Users</h1>
        {contents}
      </div>
    );
  }
}
