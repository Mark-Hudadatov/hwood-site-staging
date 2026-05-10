/**
 * MAIN ENTRY POINT
 * =================
 * Application bootstrap with React Router.
 * 
 * This replaces the old index.tsx that rendered App directly.
 * Now we render RouterProvider which handles all routing.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './i18n'; // Initialize i18n

// Global styles (Tailwind)
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
