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
    default:
      return state
  }
}