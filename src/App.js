
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import DoctorLogin from './pages/DoctorLogin';
import ReceptionLogin from './pages/ReceptionLogin';
import Navbar from './components/Navbar';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: '/doctor',
    element: (
      <>
        <Navbar />
        <DoctorLogin />
      </>
    ),
  },
  {
    path: '/reception',
    element: (
      <>
        <Navbar />
        <ReceptionLogin />
      </>
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;