import io from 'socket.io-client';
import { store } from './store';
import { chatActions, userActions } from '../actions';

const SOCKET_SERVER_URL = "http://localhost:4000";
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const UPDATE_USERS_LIST = "updateUserList";
const USER_LOGIN = "userLogin";

export const socket = io(SOCKET_SERVER_URL, { autoConnect: true });

const { onevent } = socket;

// eslint-disable-next-line func-names
socket.onevent = function (packet) {
    console.log('***', Array.prototype.slice.call(packet.data), new Date());

    onevent.call(this, packet); // original call
};

socket.on('connect', () => {
    console.log('SOCKET CONNECTED');
    const user = localStorage.getItem('user');
    if(user){
        const { id } = JSON.parse(user);
        socket.emit(USER_LOGIN, { userId: id });
    }
});

socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECT');
});

// CHAT FUNCTIONS
socket.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
    store.dispatch(chatActions.addMessage(message));
});
socket.on(UPDATE_USERS_LIST, (onlineUsers) => {
    store.dispatch(userActions.updateUserList(onlineUsers));
});

socket.sendMessage = ({ userId, message }) => {
    socket.emit(NEW_CHAT_MESSAGE_EVENT, { userId, message });
};

socket.login = ({ userId }) => {
    socket.emit(USER_LOGIN, { userId });
};

socket.callUser = ({ offer, from, to }) => {
    socket.emit('call-user', { offer, from, to });
};
socket.hangup = (user) => {
    socket.emit('hangup', { to: user.id });
    store.dispatch(chatActions.hangup(user));
};
socket.makeAnswer = async (data) => {
    socket.emit("make-answer", {
        answer: data.answer,
        to: data.user.socketId
    });
};

socket.on("call-made", async data => {
    store.dispatch(chatActions.callMade(data));
});
