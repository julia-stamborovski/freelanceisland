import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Projects from './screens/Projects';
import Clients from './screens/Clients';
import Login from './screens/Login';
import Register from './screens/Register';
import PrivateRoute from './PrivateRoute';
import Admin from './screens/Admin';
import Teste from './screens/Teste';
import AcessDenied from './screens/AcessDenied';


const router = createBrowserRouter([
   {
    path: '/',
    element: <PrivateRoute allowedRoles={['admin', 'client']}><Projects /></PrivateRoute>
  },
  {
    path: '/clientes',
    element: <PrivateRoute allowedRoles={['client']}><Clients /></PrivateRoute>
  },
  {
    path: '/teste',
    element: <PrivateRoute allowedRoles={['admin', 'client']}><Teste /></PrivateRoute>
  },
  {
    path: '/admin',
    element: <PrivateRoute allowedRoles={['admin']}><Admin /></PrivateRoute>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/access-denied',
    element: <AcessDenied />
  }
])
function App() {
  return (
   <AuthProvider className='bg-black h-full'>
    { <RouterProvider router={router}></RouterProvider>}
   </AuthProvider>
  );
}

export default App;
