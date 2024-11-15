// Register.tsx
import React, { Component, FormEvent } from 'react';
import { auth } from '../helpers/auth';
import '../styles/auth.css';

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
  private nameRef = React.createRef<HTMLInputElement>();
  private lastNameRef = React.createRef<HTMLInputElement>();
  private companyRef = React.createRef<HTMLInputElement>();

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = this.emailRef.current?.value;
    const password = this.pwRef.current?.value;
    const name = this.nameRef.current?.value;
    const lastName = this.lastNameRef.current?.value;
    const company = this.companyRef.current?.value;

    if (email && password && name && lastName && company) {
      auth(email, password, { name, lastName, company }).catch((error) =>
        this.setState(setErrorMsg(error))
      );
    } else{
      this.setState(setErrorMsg({ message: "All fields are required." }));
    }
  };

  render() {
    return (
      <div className="login-container">
        <h1 className="login-title">Sign Up</h1>
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
          <div className="form-group">
            <label>First Name</label>
            <input
              className="form-control"
              ref={this.nameRef}
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              className="form-control"
              ref={this.lastNameRef}
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              className="form-control"
              ref={this.companyRef}
              placeholder="Company"
            />
          </div>
          {this.state.registerError && (
            <div className="alert" role="alert">
              {this.state.registerError}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}
