import { useState } from 'react';
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Search from './pages/Search';
import TaskForm from './pages/TaskForm';

function Entry() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <Onboarding
        onStart={() => {
          setReady(true);
          navigate('/');
        }}
      />
    );
  }

  return <Outlet />;
}

function TaskModal() {
  return (
    <>
      <Home />
      <TaskForm />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        element: <Entry />,
        children: [
          { index: true, element: <Home /> },
          { path: 'search', element: <Search /> },
          { path: 'tasks/new', element: <TaskModal /> },
          { path: 'tasks/:id/edit', element: <TaskModal /> },
        ],
      },
    ],
  },
]);
