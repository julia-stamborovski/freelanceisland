import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import '../App.css';
import TextField from "@mui/material/TextField";
import GitHubIcon from '@mui/icons-material/GitHub';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const register = async (email, password) => {
    if (!email || !password) {
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userDocRef, {
        email: email,
      });

      // Redirect to the login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
    }
  };

  const handleRegister = async () => {
    await register(email, password);
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


  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
    <div className=" p-8 rounded shadow-md w-full max-w-md">
      <h1 className='text-white text-4xl font-bold  mb-1'>
        freelanceisland
      </h1>
      <p className='text-white/50 mb-4'>Onde todos são chefes da praia e não há crachás de tubarões! 🏝️💼</p>

      <h2 className="text-2xl font-semibold mb-8  text-white/50">Cadastre-se</h2>
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
      <button  className="bg-black hover:bg-blue-700 text-white  border-white border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 mr-12" onClick={handleRegister}>
        Registrar</button>
        <button
          className="bg-black hover:bg-blue-700 text-white border-white border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={loginWithGitHub}
        >
          Entrar com <GitHubIcon />
        </button></div>
        <p>Já possuo uma conta <a href='/login' className='text-blue-500 font-semibold hover:text-blue-400'>fazer login</a></p>
    </div>
    </div>
  );
};

export default Register;
