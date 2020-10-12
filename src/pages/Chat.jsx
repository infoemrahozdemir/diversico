import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';

import { userActions, chatActions } from '../actions';
import { socket } from '../helpers';


const scrollBottom = ({ element, lastPosition = 0 }) => {
    setTimeout(() => {
        element.scrollTop = element.scrollHeight - lastPosition;
    });
};

const { RTCPeerConnection, RTCSessionDescription } = window;

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};


class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            chatLoaded: false,
            showModal: false,
            selectedUser: {},

            startDisabled: false,
            callDisabled: true,
            hangUpDisabled: true,
            localStream: null,
            peerConnection: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOnEnter = this.handleModalOnEnter.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleCall = this.handleCall.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleHangUp = this.handleHangUp.bind(this);
        this.gotStream = this.gotStream.bind(this);
        this.gotRemoteStream = this.gotRemoteStream.bind(this);

        this.myRef = React.createRef();
        this.localVideoRef = React.createRef();
        this.remoteVideoRef = React.createRef();
    }

    componentDidMount() {
        this.props.getUsers();
        this.props.getMessages();
        scrollBottom({ element: this.myRef.current });

        socket.on("answer-made", async data => {
            const { peerConnection } = this.state;

            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socket.on("hangup", data => {
            this.props.hangup();
            this.setState({
                showModal: false,
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.chat.items && nextProps.chat.items.length>0 && (this.state.chatLoaded === false || nextProps.chat.scrollDown) ){
            scrollBottom({ element: this.myRef.current });
            this.setState({chatLoaded: true});
        }

        if(nextProps.chat.callMade){
            this.setState({showModal: true});
        }
    }

    // When you click the Start button, we ask for audio/video permissions and start a localStream.
    handleStart () {
        this.setState({
            startDisabled: true
        });
        
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(this.gotStream)
            .catch(e => alert("getUserMedia() error:" + e));
        
    };

    gotStream (stream) {
                
        const { peerConnection } = this.state;

        this.localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        this.setState({
            callDisabled: false,
            localStream: stream
        });
    };

    gotRemoteStream (event) {
        const remoteVideo = this.remoteVideoRef.current;
        if (remoteVideo.srcObject !== event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
        }
    };


    async handleCall () {
        this.setState({
            callDisabled: true,
            hangUpDisabled: false
        });
        const { selectedUser, peerConnection } = this.state;
        const { user } = this.props;
        
        //initiliaze
        await peerConnection.setLocalDescription();
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        socket.callUser({ offer: offer, from: user.id, to: selectedUser.id });


        
    };

    handleHangUp () {
        const { selectedUser, peerConnection } = this.state;
        const { users, chat } = this.props;


        if (peerConnection) {
            const senders = peerConnection.getSenders();
            senders.forEach((sender) => peerConnection.removeTrack(sender));
            peerConnection.close();
        }

        const userInfo = chat.callMade ? users.items.find(u => u.id === chat.callerData.from) : selectedUser;
        socket.hangup(userInfo);

        
        this.setState({
            startDisabled: false,
            callDisabled: true,
            hangUpDisabled: true,
            showModal: false,
        });
    };

    async handleAnswer () {
        const { users, chat } = this.props;
        const { peerConnection } = this.state;

        const userInfo = users.onlineUsers.find(u => u.userId === chat.callerData.from);
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(chat.callerData.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        await socket.makeAnswer({answer, user: userInfo});

        this.setState({
            hangUpDisabled: false,
            callDisabled: true
        });

    };

    handleModalClose(e) {
        this.handleHangUp();
        this.setState({ showModal: false });
    }

    handleModalOnEnter(e) {
        const peerConnection = new RTCPeerConnection(servers);
        peerConnection.ontrack = this.gotRemoteStream;

        this.setState({
            peerConnection
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    callUser(user) {

        this.setState({ showModal: true, selectedUser: user });
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
        const { message, showModal, selectedUser, startDisabled, callDisabled, hangUpDisabled } = this.state;

        const userInfo = chat.callMade ? users.items.find(u => u.id === chat.callerData.from) : selectedUser;
        
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
                                                    <button className="btn btn-link" onClick={() => this.callUser(user)}>Call</button>
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
                { selectedUser &&
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showModal}
                    backdrop="static"
                    keyboard={false}
                    onEnter={this.handleModalOnEnter}
                    onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Video Chat with : { userInfo.firstName } { userInfo.lastName }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <video
                                ref={this.localVideoRef}
                                id="orkun1"
                                autoPlay
                                muted
                                style={{
                                    width: "48%",
                                    height: "200px",
                                    border: "1px solid gray",
                                }}
                            />
                            <video
                                ref={this.remoteVideoRef}
                                id="orkun2"
                                autoPlay
                                style={{
                                    width: "48%",
                                    height: "200px",
                                    border: "1px solid gray",
                                }}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleStart} disabled={startDisabled}>
                            Open Camera
                        </Button>
                        {
                            !chat.callMade &&
                            <Button variant="primary" onClick={this.handleCall} disabled={callDisabled}>
                                Call
                            </Button>
                        }
                        {
                            chat.callMade &&
                            <Button variant="primary" onClick={this.handleAnswer} disabled={callDisabled}>
                                Answer
                            </Button>
                        }
                        <Button variant="primary" onClick={this.handleHangUp} disabled={hangUpDisabled}>
                            Hangup
                        </Button>
                        {
                            !chat.callMade &&
                            <Button variant="danger" onClick={this.handleModalClose}>
                                Close
                            </Button>
                        }
                    </Modal.Footer>
                </Modal>
                }
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
    hangup: chatActions.hangup,
    getUsers: userActions.getAll,
}

const connectedHomePage = connect(mapState, actionCreators)(Home);
export default connectedHomePage;