import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PartyLanding from './components/PartyLanding';
import Payment from './components/Payment';
import AddGuest from './components/AddGuest';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PartyLanding />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/guest/add" element={<AddGuest />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
