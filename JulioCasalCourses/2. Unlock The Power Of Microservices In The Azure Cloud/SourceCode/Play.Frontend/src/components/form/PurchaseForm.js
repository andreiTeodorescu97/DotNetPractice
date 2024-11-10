import React from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import authService from '../api-authorization/AuthorizeService';

export default class PurchaseForm extends React.Component
{
    state = {
        id: 0,
        name: '',
        price: '',
        quantity: 1,
        alertVisible: false,
        alertColor: '',
        alertMessage: '',
        isLoading: false,
        buttonDisabled: false,
        validated: false
    }

    connection = new HubConnectionBuilder()
        .withUrl(`${window.TRADING_SERVICE_URL}/messageHub`, { accessTokenFactory: () => authService.getAccessToken() })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    componentDidMount()
    {
        const { id, name, price } = this.props.item
        this.setState({ id, name, price });

        this.connection.on("ReceivePurchaseStatus", this.onPurchaseStatusReceived);

        this.connection.start()
            .catch(err =>
            {
                console.log('connection error');
            });
    }

    onChange = e =>
    {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitPurchase = (e) =>
    {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false)
        {
            e.stopPropagation();
        }
        else
        {
            this.purchaseItem();
        }

        this.setState({ validated: true });
    }

    async purchaseItem()
    {
        let confirmPurchase = window.confirm(`Purchase ${this.state.quantity} ${this.state.name} for ${this.state.price * this.state.quantity} gil?`);
        if (confirmPurchase)
        {
            this.setState({ buttonDisabled: true, isLoading: true, alertVisible: false })
            var idempotencyId = uuidv4();
            this.fetchRetry(idempotencyId, 3);
        }
    }

    async fetchRetry(idempotencyId, tries)
    {
        const token = await authService.getAccessToken();

        return fetch(`${window.PURCHASE_API_URL}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                itemId: this.state.id,
                quantity: parseInt(this.state.quantity),
                idempotencyId: idempotencyId
            })
        })
            .then(async response =>
            {
                if (!response.ok)
                {
                    const errorData = await response.json();
                    console.error(errorData);
                    throw new Error(`Could not purchase the item: ${errorData.title}`);
                }

                console.log('Purchase request completed with status ' + response.status);
                return response.json();
            })
            .catch(err => 
            {
                var triesLeft = tries - 1;
                if (!triesLeft)
                {
                    this.setState({
                        alertMessage: err.message,
                        alertColor: "danger",
                        buttonDisabled: false,
                        isLoading: false
                    });
                    this.showAlert(false);
                    return;
                }

                return setTimeout(() => this.fetchRetry(idempotencyId, triesLeft), 5000)
            });
    }

    onPurchaseStatusReceived = (status) =>
    {
        console.log('Received purchase status: ' + status.currentState);
        this.setState({ isLoading: false })

        if (status.currentState === "Faulted")
        {
            this.setState({
                alertMessage: "Could not purchase the item(s). " + status.errorMessage,
                alertColor: "danger",
                buttonDisabled: false
            });
            this.showAlert(false);
        }
        else
        {
            this.props.updateItemIntoState(this.state.id);
            this.setState({
                alertMessage: "Item(s) successfully purchased!",
                alertColor: "success"
            });
            this.showAlert(true);
        }
    }

    showAlert = (autoDismiss) =>
    {
        this.setState({ alertVisible: true }, () =>
        {
            if (autoDismiss)
            {
                window.setTimeout(() =>
                {
                    this.props.toggle();
                }, 2000)
            }
        });
    }

    render()
    {
        return <Form noValidate validated={this.state.validated} onSubmit={this.submitPurchase}>
            <Form.Group>
                <Form.Label htmlFor="price">Price:</Form.Label>
                <Form.Control type="number" name="price" value={this.state.price} readOnly />
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="quantity">Quantity:</Form.Label>
                <Form.Control type="number" name="quantity" onChange={this.onChange} value={this.state.quantity} required />
                <Form.Control.Feedback type="invalid">The Quantity field is required</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={this.state.buttonDisabled} >
                {this.state.isLoading ? <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true" /> : ''}
                {this.state.isLoading ? ' Purchasing…' : 'Purchase'}
            </Button>

            <Alert style={{ marginTop: "10px" }} variant={this.state.alertColor} show={this.state.alertVisible}>
                {this.state.alertMessage}
            </Alert>
        </Form>;
    }
}