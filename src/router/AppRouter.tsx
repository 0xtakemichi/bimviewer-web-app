// AppRouter.tsx
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Viewer from "../pages/Viewer";
import { logout } from '../helpers/auth';
import { firebaseAuth } from '../firebase/index';

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
  return !authed ? <Component /> : <Navigate to="/dashboard" replace />;
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
      <h1>Loading</h1>
    ) : (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">
                  IngeBIM Viewer
                </Link>
              </div>
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link to="/" className="navbar-brand">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="navbar-brand">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/viewer" className="navbar-brand">
                    Viewer
                  </Link>
                </li>
                <li>
                  {this.state.authed ? (
                    <button
                      style={{ border: 'none', background: 'transparent' }}
                      onClick={() => {
                        logout();
                        this.setState({ authed: false });
                      }}
                      className="navbar-brand"
                    >
                      Logout
                    </button>
                  ) : (
                    <span>
                      <Link to="/login" className="navbar-brand">
                        Login
                      </Link>
                      <Link to="/register" className="navbar-brand">
                        Register
                      </Link>
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={<PublicRoute authed={this.state.authed} component={Login} />}
                />
                <Route
                  path="/register"
                  element={<PublicRoute authed={this.state.authed} component={Register} />}
                />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute authed={this.state.authed} component={Dashboard} />}
                />
                <Route
                  path="/viewer"
                  element={<PrivateRoute authed={this.state.authed} component={Viewer} />}
                />
                <Route path="*" element={<h3>No Match</h3>} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
