import { REGISTER_ERROR } from "../actions/types";
import { LOGIN_ERROR } from "../actions/types";

const initalState = {
  registerErr: {},
  loginErr: {}
};

function errReducer(state = initalState, action) {
  switch (action.type) {
    case REGISTER_ERROR:
      return {
        ...state,
        registerErr: action.payload
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginErr: action.payload
      };

    default:
      return state;
  }
}

export default errReducer;
