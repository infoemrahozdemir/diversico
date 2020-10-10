import { chatConstants } from '../constants';
import { chatService } from '../services';
import { socket } from '../helpers';


function getAll() {
    return dispatch => {
        dispatch(request());

        chatService.getAll()
            .then(
                messages => dispatch(success(messages)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: chatConstants.GETALL_REQUEST } }
    function success(messages) { return { type: chatConstants.GETALL_SUCCESS, messages } }
    function failure(error) { return { type: chatConstants.GETALL_FAILURE, error } }
}

function addMessage(data) {
    return { type: chatConstants.ADD_MESSAGE_SUCCESS, data } 
}

function sendMessage(userId, message) {
    return dispatch => {
        dispatch(request({ userId, message }));

        chatService.sendMessage(userId, message)
            .then(
                result => { 
                    dispatch(success(result));
                    socket.sendMessage({ userId, message });
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(data) { return { type: chatConstants.SEND_MESSAGE_REQUEST, data } }
    function success(data) { return { type: chatConstants.SEND_MESSAGE_SUCCESS, data } }
    function failure(error) { return { type: chatConstants.SEND_MESSAGE_FAILURE, error } }
}

export const chatActions = {
    getAll,
    sendMessage,
    addMessage,
};