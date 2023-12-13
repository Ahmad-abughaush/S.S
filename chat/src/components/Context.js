import React, { createContext, useEffect, useState } from "react";
import { auth } from '../Firebase'; // Make sure you import Firebase correctly
import { onAuthStateChanged } from "firebase/auth"; // Correct the import path

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // State to store the current user
  const [currentUser, setCurrentUser] = useState({});

  // Use useEffect to set up the authentication state listener
  useEffect(() => {
    // Create a subscription to the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the current user state when authentication state changes
      setCurrentUser(user);
      console.log(user); // Log the user for debugging
    });

    // Unsubscribe from the authentication state when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
