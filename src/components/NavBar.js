import { getAuth, signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase';
import { Button } from '@mui/material';

function NavBar() {
    const auth = getAuth()
    const user = auth.currentUser 

    const handleLogout = async () => {
        try {
          await signOut(auth);
          // Redirect or perform any additional actions after logout if needed
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };

      
  return (
    <div>
 <p>Olá, {user.email}</p>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

export default NavBar