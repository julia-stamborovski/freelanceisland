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
        <img className='h-20' src='https://static.wixstatic.com/media/b1ca23_678ea2c291284b3186fe1f4bb9a742ce~mv2.png/v1/crop/x_0,y_217,w_1920,h_661/fill/w_395,h_136,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/b1ca23_678ea2c291284b3186fe1f4bb9a742ce~mv2.png' />
        </h1>
        <p className='text-white/50 mb-4'>Um laboratório para chamar de seu.</p>
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
      
        </div>
        <p>Não possuo uma conta <a href='/register'className='text-blue-500 font-semibold hover:text-blue-400'>fazer cadastro</a></p>

      </div>
    </div>
  );
};

export default Login;
