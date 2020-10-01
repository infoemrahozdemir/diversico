import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home, Login, Profile, Chat, Page404 } from '../pages';

export default class Main extends Component {
    render() {
    return (
        <Container as="main" role="main">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/chat" component={Chat} />
                    <Route path="/*" component={Page404} />
                </Switch>
            </BrowserRouter>
        </Container>
    )
    }
}