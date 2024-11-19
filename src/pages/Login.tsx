import { useState, useRef, FormEvent } from 'react';
import { login, resetPassword } from '../helpers/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

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
    <Container fluid className="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Log In</h2>
        {loginMessage && <Alert variant="danger">{loginMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailRef}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={pwRef}
            />
          </Form.Group>

          {loginMessage && (
            <Alert variant="danger">
              {loginMessage}{' '}
              <Alert.Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
              >
                Forgot Password?
              </Alert.Link>
            </Alert>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Log In
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;