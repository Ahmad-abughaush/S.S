import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import '../src/Style.scss';
import { useContext } from 'react';
import { AuthContext } from './components/Context';



{/* <Route
path="/"
element={
  currentuser ? (
    <Home />
  ) : (
    <Navigate to="/Login" replace /> // Redirect to Login if not authenticated
  )
}
/> */}


function App() {
  const { currentuser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
      <Route
path="/"
element={

    <Home />         
}
/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
