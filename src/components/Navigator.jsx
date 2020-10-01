import React, { Component } from 'react';
import {
    Navbar,
    Nav,
    Dropdown,
    Form,
    Button,
    NavDropdown,
} from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';


export default class Navigator extends Component {
    render() {
        return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/chat">Chat</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        )
    }
}