import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './router/AppRouter'

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);