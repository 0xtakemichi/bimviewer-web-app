import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './hooks/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve AppRouter con AuthProvider */}
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);