// Register.tsx
import React, { Component, FormEvent } from 'react';
import { auth } from '../helpers/auth';

interface RegisterState {
  registerError: string | null;
}

function setErrorMsg(error: { message: string }) {
  return {
    registerError: error.message,
  };
}

export default class Register extends Component<{}, RegisterState> {
  state: RegisterState = { registerError: null };

  // Definimos las referencias tipadas
  private emailRef = React.createRef<HTMLInputElement>();
  private pwRef = React.createRef<HTMLInputElement>();

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = this.emailRef.current?.value;
    const password = this.pwRef.current?.value;

    if (email && password) {
      auth(email, password).catch((error) =>
        this.setState(setErrorMsg(error))
      );
    }
  };

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              ref={this.emailRef}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={this.pwRef}
            />
          </div>
          {this.state.registerError && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    );
  }
}
