import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { userActions, chatActions } from '../actions';

const scrollBottom = ({ element, lastPosition = 0 }) => {
    setTimeout(() => {
        element.scrollTop = element.scrollHeight - lastPosition;
    });
};

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            chatLoaded: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.props.getUsers();
        this.props.getMessages();
        scrollBottom({ element: this.myRef.current });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.chat.items && nextProps.chat.items.length>0 && (this.state.chatLoaded === false || nextProps.chat.scrollDown) ){
            scrollBottom({ element: this.myRef.current });
            this.setState({chatLoaded: true});
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { message } = this.state;
        const { user } = this.props;
        const userId = user.id;
        if (message) {
            this.props.sendMessage(userId, message);
            this.setState({ submitted: false, chatLoaded: false, message: '' });
            scrollBottom({ element: this.myRef.current });
        }
    }

    renderIncomingMessage(data, user) {
        return (
            <div key={data.id} className="incoming_msg">
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
            <div key={data.id} className="outgoing_msg">
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
        const { message } = this.state;

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
                                        <div key={user.id} className="chat_people border-bottom pb-1">
                                            <div className="chat_img">
                                                
                                                <img
                                                    src={user.image}
                                                    alt="sunil"
                                                />
                                            </div>
                                            <div className="chat_ib">
                                                <h5 style={{ marginBottom: 0}}>
                                                    {user.firstName + ' ' + user.lastName}
                                                </h5>
                                                { users.onlineUsers && users.onlineUsers.find(r => r.userId === user.id) &&
                                                <>
                                                    <span className="badge badge-success mr-1">Online</span>
                                                    <a className="badge badge-success" href="/">
                                                        Call
                                                    </a>
                                                </>
                                                }
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mesgs">

                        <div className="msg_history" ref={this.myRef}>
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
                                <form className="form-inline" name="form" onSubmit={this.handleSubmit}>
                                    <div className="form-group mx-sm-3 mb-2" style={{ width: '70%' }}>
                                        <input
                                            style={{ width: '100%' }}
                                            type="text"
                                            className="write_msg"
                                            placeholder="Type a message"
                                            name="message" 
                                            value={message} 
                                            onChange={this.handleChange} 
                                            required
                                        />
                                    </div>
                                    <button className="btn btn-primary">Send</button>
                                </form>
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
    sendMessage: chatActions.sendMessage,
    getMessages: chatActions.getAll,
    getUsers: userActions.getAll,
}

const connectedHomePage = connect(mapState, actionCreators)(Home);
export default connectedHomePage;