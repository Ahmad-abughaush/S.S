import React, { useState,useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes,useLocation } from 'react-router-dom';
import Home from './components/Home'; 
import Signup from './components/Signup';
import Login from './components/Login';
import WaitingHome from './components/WaitingHome';
import Admindashboard from './components/Admindashboard';
function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Signup />} path="/Signup" />
        <Route element={<Login />} path="/Login" />
        <Route element={<WaitingHome />} path="/WaitingHome" />
        <Route element={<Admindashboard />} path="/Admindashboard" />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
