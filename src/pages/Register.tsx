import React, { useState, useRef, FormEvent } from 'react';
import { auth } from '../helpers/auth';
import { jobTitles, countries } from '../data';
import { trackUserSignUp } from '../helpers/analytics';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

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
        trackUserSignUp(userCredential.user.uid);
      } catch (error: any) {
        setErrorMsg(error.message || 'An error occurred during registration.');
      }
    } else {
      setErrorMsg('All fields are required.');
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {registerError && <Alert variant="danger">{registerError}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" ref={pwRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="First Name" ref={nameRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Last Name" ref={lastNameRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCompany">
            <Form.Label>Company</Form.Label>
            <Form.Control type="text" placeholder="Company" ref={companyRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formJobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Select ref={jobTitleRef}>
              <option value="">Select Job Title</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCountry">
            <Form.Label>Country</Form.Label>
            <Form.Select ref={countryRef}>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;