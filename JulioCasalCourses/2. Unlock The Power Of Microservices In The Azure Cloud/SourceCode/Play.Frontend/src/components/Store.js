import React, { Component } from 'react';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import PurchaseModal from './form/PurchaseModal';
import authService from './api-authorization/AuthorizeService';

export class Store extends Component
{
  static displayName = Store.name;

  constructor(props)
  {
    super(props);
    this.state = { items: [], userGil: 0, loading: true, loadedSuccess: false };
  }

  componentDidMount()
  {
    this.populateItems();
  }

  updateState = (id) =>
  {
    this.populateItems();
  }

  async populateItems()
  {
    const token = await authService.getAccessToken();
    fetch(`${window.STORE_API_URL}`, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => this.setState({ items: res.items, userGil: res.userGil, loading: false, loadedSuccess: true }))
      .catch(err =>
      {
        console.log(err);
        this.setState({ items: [], loading: false, loadedSuccess: false })
      });
  }

  renderItemsTable(items)
  {
    return <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
      <Row className="align-items-center">
        <Col align='right' style={{ textAlign: "right", padding: "0px" }} >
          <Form.Label style={{ margin: "0px" }}>My Gil:</Form.Label>
        </Col>
        <Col xs={2}>
          <Form.Control type="number" name="gil" id="gil" value={this.state.userGil} style={{ textAlign: "right", padding: "0px" }} readOnly />
        </Col>
      </Row>
      <Row style={{ paddingTop: "5px" }}>
        <Col>
          <Table striped>
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Owned</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length <= 0 ?
                <tr>
                  <td colSpan="6" align="center"><b>No Items yet</b></td>
                </tr>
                : items.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.description}
                    </td>
                    <td>
                      {item.price}
                    </td>
                    <td>
                      {item.ownedQuantity}
                    </td>
                    <td align="center">
                      <PurchaseModal
                        item={item}
                        updateItemIntoState={this.updateState} />
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
        ? this.renderItemsTable(this.state.items)
        : <p>Could not load items</p>;

    return (
      <div>
        <h1 id="tabelLabel" >Store Items</h1>
        {contents}
      </div>
    );
  }
}
