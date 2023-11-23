import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css';
import TextField from "@mui/material/TextField";
import GitHubIcon from '@mui/icons-material/GitHub';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const loginWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userDetails = {
        email: user.email,
        displayName: user.displayName,
      };

      console.log('GitHub User Details:', userDetails);

      navigate('/');
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const handleLogin = async () => {
    await login(email, password);
    console.log('Usuário', email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className=" p-8 rounded shadow-md w-full max-w-md">
        <h1 className='text-white text-4xl font-bold  mb-1'>
          freelanceisland
        </h1>
        <p className='text-white/50 mb-4'>Onde todos são chefes da praia e não há crachás de tubarões! 🏝️💼</p>
        <h2 className="text-2xl font-semibold mb-8  text-white/50">Login</h2>
        <div className='pb-12'>
        <TextField
          label="E-mail"
          type="email"
          className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
</div>
<div className=' items-center gap-2'>
        <button
          className="bg-black hover:bg-blue-700 text-white  border-white border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 mr-12"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-black hover:bg-blue-700 text-white border-white border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={loginWithGitHub}
        >
          Entrar com <GitHubIcon />
        </button>
        </div>
        <p>Não possuo uma conta <a href='/register'className='text-blue-500 font-semibold hover:text-blue-400'>fazer cadastro</a></p>

      </div>
    </div>
  );
};

export default Login;
