// AppRouter.tsx
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import UserPage from '../pages/User';
import Viewer from '../pages/Viewer';
import ProjectsPage from '../pages/Projects';
import { logout } from '../helpers/auth';
import { firebaseAuth } from '../firebase/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

interface RouteProps {
  component: React.ComponentType<any>;
  authed: boolean;
}

// PrivateRoute: solo permite acceso si el usuario está autenticado
function PrivateRoute({ component: Component, authed }: RouteProps) {
  return authed ? <Component /> : <Navigate to="/login" replace />;
}

// PublicRoute: solo permite acceso si el usuario no está autenticado
function PublicRoute({ component: Component, authed }: RouteProps) {
  return !authed ? <Component /> : <Navigate to="/projects" replace />;
}

// Componente principal del Router
class AppRouter extends Component<{}, { authed: boolean; loading: boolean }> {
  private removeListener: any;

  state = {
    authed: false,
    loading: true,
  };

  // Manejador de autenticación
  componentDidMount() {
    this.removeListener = firebaseAuth.onAuthStateChanged((user) => {
      this.setState({
        authed: !!user,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return this.state.loading ? (
      <h1>Cargando</h1>
    ) : (
      <BrowserRouter>
        <div>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/">
                <img
                  src="/IngeBIM.png"
                  alt="IngeBIM"
                  height="30"
                  className="d-inline-block align-top"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/dashboard">
                    Panel
                  </Nav.Link>
                  <Nav.Link as={Link} to="/projects">
                    Proyectos
                  </Nav.Link>
                  <Nav.Link as={Link} to="/viewer">
                    Viewer
                  </Nav.Link>
                </Nav>
                <Nav>
                  {this.state.authed ? (
                    <>
                      <Nav.Link as={Link} to="/user">
                        Perfil
                      </Nav.Link>
                      <Button
                        variant="outline-light"
                        onClick={() => {
                          logout();
                          this.setState({ authed: false });
                        }}
                        className="ms-2"
                      >
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/login">
                        Iniciar sesión
                      </Nav.Link>

                      <Nav.Link as={Link} to="/register">
                        Registrate
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container fluid className="p-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute authed={this.state.authed} component={Login} />} />
              <Route path="/register" element={<PublicRoute authed={this.state.authed} component={Register} />} />
              <Route path="/dashboard" element={<PrivateRoute authed={this.state.authed} component={Dashboard} />} />
              <Route path="/viewer" element={<PrivateRoute authed={this.state.authed} component={Viewer} />} />
              <Route path="/user" element={<PrivateRoute authed={this.state.authed} component={UserPage} />} />
              <Route path="/projects" element={<PrivateRoute authed={this.state.authed} component={ProjectsPage} />} />
              <Route path="/projects/viewer/:id" element={<PrivateRoute authed={this.state.authed} component={Viewer} />} />
              <Route path="*" element={<h3>Enlace Incorrecto</h3>} />r
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRouter;