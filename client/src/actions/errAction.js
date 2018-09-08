import { REGISTER_ERROR } from "./types";
import { LOGIN_ERROR } from "./types";

export function errRegister(err) {
  return {
    type: REGISTER_ERROR,
    payload: err
  };
}

export function errLogin(err) {
  return {
    type: LOGIN_ERROR,
    payload: err
  };
}
