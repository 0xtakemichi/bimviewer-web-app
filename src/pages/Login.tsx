import { useState, useRef, FormEvent } from 'react';
import { login, resetPassword } from '../helpers/auth';
import '../styles/auth.css';


const Login: React.FC = () => {
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const pwRef = useRef<HTMLInputElement | null>(null);

  function setErrorMsg(error: string) {
    return `Error: ${error}`;
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = pwRef.current?.value;
  
    if (email && password) {
      try {
        await login(email, password);
      } catch (error) {
        setLoginMessage(setErrorMsg('Invalid username/password.'));
      }
    }
  };

  const handleResetPassword = async () => {
    const email = emailRef.current?.value;

    if (email) {
      try {
        await resetPassword(email);
        setLoginMessage(`Password reset email sent to ${email}.`);
      } catch {
        setLoginMessage(`Email address not found.`);
      }
    }
  };


  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            ref={emailRef}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            ref={pwRef}
          />
        </div>
        {loginMessage && (
          <div className="alert" role="alert">
            {loginMessage}{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
              className="alert-link"
            >
              Forgot Password?
            </a>
          </div>
        )}
        <button type="submit" className="login-btn">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;