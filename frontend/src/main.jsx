import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ensureSession } from './api/session';
import { router } from './App';
import './index.css';

function SessionGate() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    ensureSession()
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setError('Could not start a session');
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="p-6 text-sm text-red-600">{error}</p>;
  }

  if (!ready) return null;

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionGate />
  </StrictMode>
);
