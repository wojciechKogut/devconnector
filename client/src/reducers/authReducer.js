import { SET_CURRENT_USER } from "../actions/types";
import isEmpty from "../validation/is_empty";

const initalState = {
  isAuthenticated: false,
  user: {}
};

function authReducer(state = initalState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };

    default:
      return state;
  }
}

export default authReducer;
