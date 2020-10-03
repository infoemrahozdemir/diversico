import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../actions';

class Profile extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }
    render() {
        const { user } = this.props;
        return (
            <div class="container">
              <div class="jumbotron" style={{ margin: "0 auto", width: "600px" }}>
                <div class="row">
                  <div class="col-md-6 img">
                    <img src={user.image} width="150"  alt="" class="img-rounded" />
                  </div>
                  <div class="col-md-6 details">
                    <blockquote>
                      <h5>{user.firstName} {user.lastName}</h5>
                    </blockquote>
                    <p>
                      <Link to="/login">Logout</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedProfilePage = connect(mapState, actionCreators)(Profile);
export default connectedProfilePage;

