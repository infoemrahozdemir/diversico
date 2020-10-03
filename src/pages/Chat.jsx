import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { userActions, chatActions } from '../actions';

class Home extends React.Component {
    componentDidMount() {
        this.props.getUsers();
        this.props.getMessages();
    }

    renderIncomingMessage(data, user) {
        return (
            <div className="incoming_msg">
                <div className="incoming_msg_img">
                    <img
                        src={user.image}
                        alt={user.firstName}
                    />
                </div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        <p>
                            {data.message}
                        </p>
                        <span className="time_date">
                            {moment(data.datetime).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    renderOutgoingMessage(data, user) {
        return (
            <div className="outgoing_msg">
                <div className="sent_msg">
                    <p>
                        {data.message}
                    </p>
                    <span className="time_date">
                        {moment(data.datetime).fromNow()}
                    </span>
                </div>
            </div>
        );
    }

    render() {
        const { user, users, chat } = this.props;
        console.log("ORKUN", chat, users);
        return (
            <div className="messaging">
                <div className="inbox_msg">
                    <div className="inbox_people">
                        <div className="headind_srch">
                            <div className="recent_heading">
                                <h4>Users</h4>
                            </div>
                        </div>
                        <div className="inbox_chat scroll">
                            <div className="chat_list active_chat">
                                {users.loading && <em>Loading users...</em>}
                                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                                {users.items &&
                                    <div>
                                        {users.items.filter(u=>u.id !== user.id).map((user, index) =>
                                        <div key={user.id} className="chat_people">
                                            <div className="chat_img">
                                                
                                                <img
                                                    src={user.image}
                                                    alt="sunil"
                                                />
                                            </div>
                                            <div className="chat_ib">
                                                <h5>
                                                    {user.firstName + ' ' + user.lastName}
                                                </h5>
                                                <p>
                                                    Test, which is a new approach to
                                                    have all solutions astrology under
                                                    one roof.
                                                </p>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mesgs">

                        <div className="msg_history">
                            {
                                chat.items &&
                                <div>
                                    {chat.items.map((message, index) => {
                                        const messageUser = users.items.find(u=>u.id === message.userId);
                                        if (message.userId === user.id) return this.renderOutgoingMessage(message, user);
                                        return this.renderIncomingMessage(message, messageUser);
                                    }
                                    )}
                                </div>
                            }
                        </div>
                        <div className="type_msg">
                            <div className="input_msg_write">
                                <input
                                    type="text"
                                    className="write_msg"
                                    placeholder="Type a message"
                                />
                                <button className="msg_send_btn" type="button">
                                    <i
                                        className="fa fa-paper-plane"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, chat, authentication } = state;
    const { user } = authentication;
    return { user, users, chat };
}

const actionCreators = {
    getMessages: chatActions.getAll,
    getUsers: userActions.getAll,
}

const connectedHomePage = connect(mapState, actionCreators)(Home);
export default connectedHomePage;