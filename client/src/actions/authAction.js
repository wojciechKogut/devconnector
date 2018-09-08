import { SET_CURRENT_USER } from "./types";
import { errRegister } from "../actions/errAction";
import { errLogin } from "../actions/errAction";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import decode from "jwt-decode";

const isEmpty = require("../validation/is_empty");

export const registerUser = (user, history) => dispatch => {
  axios
    .post("/api/users/register", user)
    .then(() => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: user
      });
      history.push("/login");
    })
    .catch(err => {
      if (!isEmpty(err)) {
        dispatch(errRegister(err.response.data));
      }
    });
};

export const loginUser = (user, history) => dispatch => {
  axios
    .post("/api/users/login", user)
    .then(res => {
      const { token } = res.data;

      //set token to local storage
      localStorage.setItem("token", token);

      //set token to Auth header
      setAuthToken(token);

      //decode token, pull out user data
      const user = decode(token);
      dispatch(setCurrentUser(user));

      history.push("/dashboard");
    })
    .catch(err => {
      if (!isEmpty(err)) {
        dispatch(errLogin(err.response.data));
      }
    });
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const logoutUser = history => dispatch => {
  //unset jwt token from localstorage
  localStorage.removeItem("token");

  const token = localStorage.getItem("token");

  //delete token
  setAuthToken(token);

  //set isAuthenticated to false, if pass {}, this automically set isAuthenticated to false
  dispatch(setCurrentUser({}));

  //redirect to homepage
  history.push("/");
};
