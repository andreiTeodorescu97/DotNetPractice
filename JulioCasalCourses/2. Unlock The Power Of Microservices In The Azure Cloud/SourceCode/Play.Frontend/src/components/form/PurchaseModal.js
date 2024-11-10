import React, { Component, Fragment } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PurchaseForm from './PurchaseForm';
export default class PurchaseModal extends Component
{
    state = {
        modal: false
    }
    toggle = () =>
    {
        this.setState(previous => ({
            modal: !previous.modal
        }));
    }
    render()
    {
        return <Fragment>
            <Button variant="primary" onClick={this.toggle}>Purchase</Button>
            <Modal show={this.state.modal} className={this.props.className} onHide={this.toggle} size="sm">
                <Modal.Header closeButton>Purchase {this.props.item.name}</Modal.Header>
                <Modal.Body>
                    <PurchaseForm
                        toggle={this.toggle}
                        item={this.props.item}
                        updateItemIntoState={this.props.updateItemIntoState} />
                </Modal.Body>
            </Modal>
        </Fragment>;
    }
}