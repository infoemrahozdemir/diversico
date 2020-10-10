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
      return state;
    case chatConstants.ADD_MESSAGE_SUCCESS:
      const id = state.items.length ? Math.max(...state.items.map(m => m.id)) + 1 : 1;
      return {
        ...state,
        scrollDown: true,
        items: [ ...state.items, { id, ...action.data } ],
      };
    default:
      return state
  }
}