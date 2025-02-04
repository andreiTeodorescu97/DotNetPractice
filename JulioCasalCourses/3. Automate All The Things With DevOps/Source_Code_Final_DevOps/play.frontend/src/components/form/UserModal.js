import React, { Component, Fragment } from 'react';
import { Button, Modal } from 'react-bootstrap';
import UserForm from './UserForm';
export default class UserModal extends Component
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
        let title = 'Edit User';
        return <Fragment>
            <Button
                variant="primary"
                onClick={this.toggle}>Edit</Button>
            <Modal show={this.state.modal} className={this.props.className} onHide={this.toggle}>
                <Modal.Header closeButton>{title}</Modal.Header>
                <Modal.Body>
                    <UserForm
                        updateUserIntoState={this.props.updateUserIntoState}
                        toggle={this.toggle}
                        user={this.props.user} />
                </Modal.Body>
            </Modal>
        </Fragment>;
    }
}