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


const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Projects /></PrivateRoute>
  },
  {
    path: '/clientes',
    element: <PrivateRoute><Clients /></PrivateRoute>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
])
function App() {
  return (
   <AuthProvider className='bg-black h-full'>
    { <RouterProvider router={router}></RouterProvider>}
   </AuthProvider>
  );
}

export default App;
