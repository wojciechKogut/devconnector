import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../actions/authAction";

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  logout(e) {
    e.preventDefault();

    //logout user
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { user, isAuthenticated } = this.props.auth;
    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to={"/register"}>
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={"/login"}>
            Login
          </Link>
        </li>
      </ul>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <img
            className="img-responsive rounded-circle"
            src={user.avatar}
            style={{ width: "40px" }}
          />
        </li>
        <li className="nav-item">
          <a className="nav-link">{user.name}</a>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to={"/logut"}
            onClick={this.logout.bind(this)}
          >
            Logut
          </Link>
        </li>
      </ul>
    );

    const links = isAuthenticated ? authLinks : guestLinks;

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/profiles"}>
                  {" "}
                  Developerss
                </Link>
              </li>
            </ul>
            {links}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
