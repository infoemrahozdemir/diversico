import { chatConstants } from '../constants';

export function chat(state = {}, action) {
  
  switch (action.type) {
    case chatConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case chatConstants.GETALL_SUCCESS:
      return {
        items: action.messages
      };
    case chatConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case chatConstants.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        items: [ ...state.items, action.data ],
      };
    default:
      return state
  }
}