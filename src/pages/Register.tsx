// Register.tsx
import React, { useState, useRef, FormEvent } from 'react';
import { auth } from '../helpers/auth';
import '../styles/auth.css';

const Register: React.FC = () => {
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Definimos referencias
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);

  const setErrorMsg = (message: string) => {
    setRegisterError(message);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = pwRef.current?.value;
    const name = nameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const company = companyRef.current?.value;

    if (email && password && name && lastName && company) {
      try {
        await auth(email, password, { name, lastName, company });
      } catch (error: any) {
        setErrorMsg(error.message || 'An error occurred during registration.');
      }
    } else {
      setErrorMsg('All fields are required.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" ref={emailRef} placeholder="Email" />
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
        <div className="form-group">
          <label>First Name</label>
          <input
            className="form-control"
            ref={nameRef}
            placeholder="First Name"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            className="form-control"
            ref={lastNameRef}
            placeholder="Last Name"
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input
            className="form-control"
            ref={companyRef}
            placeholder="Company"
          />
        </div>
        {registerError && (
          <div className="alert" role="alert">
            {registerError}
          </div>
        )}
        <button type="submit" className="register-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;