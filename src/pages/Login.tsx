import { Component, FormEvent } from 'react'
import { login, resetPassword } from '../helpers/auth'

function setErrorMsg(error: string) {
  return {
    loginMessage: error
  }
}

interface LoginState {
  loginMessage: string | null
}

export default class Login extends Component<{}, LoginState> {
  state: LoginState = { loginMessage: null }

  // Referencias a los campos de email y password
  private email: HTMLInputElement | null = null;
  private pw: HTMLInputElement | null = null;

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (this.email && this.pw) {
      login(this.email.value, this.pw.value)
        .catch(() => {
          this.setState(setErrorMsg('Invalid username/password.'));
        });
    }
  }

  resetPassword = () => {
    if (this.email) {
      resetPassword(this.email.value)
        .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email!.value}.`)))
        .catch(() => this.setState(setErrorMsg(`Email address not found.`)));
    }
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              ref={(email) => this.email = email}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={(pw) => this.pw = pw}
            />
          </div>
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage} <a href="#" onClick={this.resetPassword} className="alert-link">Forgot Password?</a>
            </div>
          }
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    )
  }
}
