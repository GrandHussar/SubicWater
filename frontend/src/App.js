import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Management from './components/Management';
import axios from 'axios';

function App() {
  // ✅ Persist login using localStorage
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const [phData, setPhData] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      axios.get('http://localhost:5000/api/ph', { withCredentials: true })
        .then(response => setPhData(response.data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [loggedIn]);

  // ✅ Handle login success
  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  // ✅ Optional: handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Only show dashboard if logged in */}
        <Route path="/" element={loggedIn ? <Dashboard phData={phData} /> : <Navigate to="/login" />} />
        <Route path="/reports" element={loggedIn ? <Reports /> : <Navigate to="/login" />} />
       <Route
  path="/settings"
  element={loggedIn ? <Settings onLogout={handleLogout} /> : <Navigate to="/login" />}
/>

        <Route path="/management" element={loggedIn ? <Management /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
