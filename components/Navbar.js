import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  IconButton,
  Avatar
} from '@mui/material';
import { AuthContext } from '../context';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="fixed" color="primary" elevation={1}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Quản Lý Thu Chi
          </Link>
        </Typography>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: 'white', 
              color: '#4caf50',
              width: 36,
              height: 36,
              marginRight: 1
            }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.name}
            </Typography>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
