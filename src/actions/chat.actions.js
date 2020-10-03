import { chatConstants } from '../constants';
import { chatService } from '../services';

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

export const chatActions = {
    getAll,
};