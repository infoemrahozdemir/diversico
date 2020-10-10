import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { history, socket } from './helpers';
import { alertActions } from './actions';
import { PrivateRoute } from './components';
import { Home, Login, Profile, Chat } from './pages';
import { Navigator } from './components';



import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
        // clear alert on location change
        this.props.clearAlerts();
    });

    socket.open();
  }
  render() {
    const { alert } = this.props;
    return (
      <>
        <Navigator />
        <div className="container">
                {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                }
                <Router history={history}>
                    <Switch>
                        <PrivateRoute exact path="/" component={Home} />
                        <PrivateRoute exact path="/profile" component={Profile} />
                        <PrivateRoute exact path="/chat" component={Chat} />
                        <Route path="/login" component={Login} />
                        <Route path="*" component={Login} />
                        <Redirect from="*" to="/" />
                    </Switch>
                </Router>
        </div>
      </>
    );
  }
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp;