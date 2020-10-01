import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class Page extends Component {
    render() {
        return (
            <div class="content">
                <div class="jumbotron" style={{ margin: "0 auto", width: "50%" }}>
                    <h3>Login</h3>
                    <hr />
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                autofocus
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}
