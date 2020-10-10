import io from 'socket.io-client';
import { store } from './store';
import { chatActions } from '../actions';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:4000";

export const socket = io(SOCKET_SERVER_URL, { autoConnect: true });

const { onevent } = socket;

// eslint-disable-next-line func-names
socket.onevent = function (packet) {
    console.log('***', Array.prototype.slice.call(packet.data), new Date());

    onevent.call(this, packet); // original call
};

socket.on('connect', () => {
    console.log('SOCKET CONNECTED');
});

socket.on('disconnect', () => {
    console.log('SOCKET DISCONNECT');
});

// CHAT FUNCTIONS
socket.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
    store.dispatch(chatActions.addMessage(message));
});

socket.sendMessage = ({ userId, message }) => {
    socket.emit(NEW_CHAT_MESSAGE_EVENT, { userId, message });
};