import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

export default class Main extends Component {
    render() {
    return (
        <Container as="main" role="main">
            <div className="starter-template">
                <h1>Bootstrap starter template</h1>
                
                    Use this document as a way to quickly start any new project.<br />
                    All you get is this text and a mostly barebones HTML document.
              
            </div>
        </Container>
    )
    }
}