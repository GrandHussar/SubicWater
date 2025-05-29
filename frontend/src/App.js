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
  const [loggedIn, setLoggedIn] = useState(false);
  const [phData, setPhData] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      axios.get('http://localhost:5000/api/ph', { withCredentials: true })
        .then(response => setPhData(response.data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [loggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={loggedIn ? <Dashboard phData={phData} /> : <Navigate to="/login" />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/management" element={<Management />} />
      </Routes>
    </Router>
  );
}

export default App;
