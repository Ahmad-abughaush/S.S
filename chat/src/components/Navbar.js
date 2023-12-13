import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from './Context';

const Navbar = ({ onLogout }) => {

const {currentUser}=useContext(AuthContext)


  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      // Notify the parent component to clear the context
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='navbar'>
      <span className='logo'>Lama Chat</span>
      <div className='user'>
        <img
          src={currentUser?.photoURL }
          alt='User'
        />
        <span>{currentUser?.displayName}</span>
        <button onClick={handleSignOut}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
