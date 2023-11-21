import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div>
      <h2>Register</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
