import React, { Component } from 'react';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import authService from './api-authorization/AuthorizeService'

export class Inventory extends Component {
  static displayName = Inventory.name;

  constructor(props) {
    super(props);
    this.state = { items: [], loading: true, loadedSuccess: false };
  }

  componentDidMount() {
    this.populateItems();
  }

  async populateItems() {

    let userId = '';

    if (this.cameFromUsersPage()) {
      userId = this.props.location.user.id;
    }
    else {
      const user = await authService.getUser();
      userId = user.sub;
    }

    const token = await authService.getAccessToken();
    fetch(`${window.INVENTORY_ITEMS_API_URL}?userId=${userId}`, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(returnedItems => this.setState({ items: returnedItems, loading: false, loadedSuccess: true }))
      .catch(err => {
        console.log(err);
        this.setState({ items: [], loading: false, loadedSuccess: false })
      });
  }

  renderItemsTable(items) {
    return <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
      <Row>
        <Col>
          <Table striped>
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length <= 0 ?
                <tr>
                  <td colSpan="6" align="center"><b>No Items yet</b></td>
                </tr>
                : items.map(item => (
                  <tr key={item.catalogItemId}>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.description}
                    </td>
                    <td>
                      {item.quantity}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button color="primary" hidden={!this.cameFromUsersPage()} onClick={() => this.props.history.goBack()}>Back to Users</Button>
        </Col>
      </Row>
    </Container>;
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.state.loadedSuccess
        ? this.renderItemsTable(this.state.items)
        : <p>Could not load items</p>;

    return (
      <div>
        <h1 id="tabelLabel" >{this.cameFromUsersPage() ? this.props.location.user.username : 'My'} Inventory</h1>
        {contents}
      </div>
    );
  }

  cameFromUsersPage() {
    var val = this.props.location.user != null;
    return val;
  }
}
