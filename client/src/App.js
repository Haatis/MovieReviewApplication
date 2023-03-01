import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header.js';
import ReviewsPage from './pages/ReviewsPage';
import ActorPage from './pages/ActorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css'


export default function App() {
  
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/ReviewsPage/:id" element={<ReviewsPage />} />
        <Route path="/ActorPage/:id" element={<ActorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      </>
  );
}