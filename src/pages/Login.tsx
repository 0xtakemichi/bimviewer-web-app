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
        setLoginMessage(setErrorMsg('Campo incorrecto correo/contraseña.'));
      }
    }
  };

  const handleResetPassword = async () => {
    const email = emailRef.current?.value;

    if (email) {
      try {
        await resetPassword(email);
        setLoginMessage(`Correo de restablecimiento de contraseña enviado a ${email}.`);
      } catch {
        setLoginMessage(`Dirección de correo electrónico no encontrada`);
      }
    }
  };

  return (
    <Container fluid className="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        {loginMessage && <Alert variant="danger">{loginMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              ref={emailRef}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              ref={pwRef}
            />
          </Form.Group>

          {loginMessage && (
            <Alert variant="" className="text-center">
              <Alert.Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
              >
                ¿Olvidó su contraseña?
              </Alert.Link>
            </Alert>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Ingresar
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;