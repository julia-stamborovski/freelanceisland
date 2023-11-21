import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore if needed
      // const userDoc = await getDoc(doc(db, 'users', user.uid));

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
  
      // Now you can use userDetails.email and userDetails.displayName as needed
      // For example, you can save this information to Firestore or use it in your application
  
      // Fetch user data from Firestore if needed
      // const userDoc = await getDoc(doc(db, 'users', user.uid));
  
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
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  );
};

export default Login;
