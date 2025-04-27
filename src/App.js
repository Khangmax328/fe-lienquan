import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/AccountDetailsPage';
import CartPage from './pages/CartPage';
import SignUpPage from './pages/SignUpPage'
import useAutoLogin from './hooks/useAutoLogin';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import NapATMPage from './pages/NapATMPage';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import AllAccountsPage from './pages/AllAccountsPage';
import { Navigate } from 'react-router-dom';
function App() {
  useAutoLogin()
  return (
    
    <div className="app-wrapper">
    <Router>
      <div className="App">
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} /> 
      <Route path="/home" element={<LandingPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/accountDetails/:id" element={<AccountDetailsPage />} />
        <Route path="/order-details/:id" element={<OrderDetailsPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/banking" element={<NapATMPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/allAccounts" element={<AllAccountsPage />} />

      </Routes> 
      </div>
    </Router>
    </div>
  );
}

export default App;
