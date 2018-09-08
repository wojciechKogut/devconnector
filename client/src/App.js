import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import decode from "jwt-decode";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import setAuthToken from "./utils/setAuthToken";
import history from "./history";
import isEmpty from "./validation/is_empty";
import { setCurrentUser, logoutUser } from "./actions/authAction";

if (!isEmpty(localStorage.getItem("token"))) {
  //set auth token to header
  setAuthToken(localStorage.token);

  //pull data from token
  const user = decode(localStorage.token);

  //dipatch action
  store.dispatch(setCurrentUser(user));

  const currentTime = Date.now() / 1000;
  if (currentTime > user.exp) {
    store.dispatch(logoutUser(this.props.history));
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/logout" component={Navbar} />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
