import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { auth } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import '../App.css';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const auth = getAuth()
  const user = auth.currentUser 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className='appbar'>
        <Toolbar>
     
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='logo'>
            <img className='h-20' src='https://static.wixstatic.com/media/b1ca23_678ea2c291284b3186fe1f4bb9a742ce~mv2.png/v1/crop/x_0,y_217,w_1920,h_661/fill/w_395,h_136,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/b1ca23_678ea2c291284b3186fe1f4bb9a742ce~mv2.png' />
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}> {user.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}