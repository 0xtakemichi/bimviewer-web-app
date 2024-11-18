import React, { useState, useRef, FormEvent } from 'react';
import { auth } from '../helpers/auth';
import { jobTitles, countries } from '../data';
import { trackUserSignUp } from '../helpers/analytics';
import '../styles/auth.css';

const Register: React.FC = () => {
  const [registerError, setRegisterError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const jobTitleRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);

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
    const jobTitle = jobTitleRef.current?.value;
    const country = countryRef.current?.value;

    if (email && password && name && lastName && company && jobTitle && country) {
      try {
        const userCredential = await auth(email, password, { name, lastName, company, jobTitle, country });
        // Registrar evento de registro en Analytics
        trackUserSignUp(userCredential.user.uid);
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
        <div className="form-group">
          <label>Job Title</label>
          <select className="form-control" ref={jobTitleRef}>
            <option value="">Select Job Title</option>
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Country</label>
          <select className="form-control" ref={countryRef}>
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
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