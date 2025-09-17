import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Categories from './pages/Categories';
import BestSellers from './pages/BestSellers';
import NewArrivals from './pages/NewArrivals';
import Contact from './pages/Contact';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <marquee>Limited Time Offer: All Books 50% OFF</marquee>
      <hr />
      <header>
        <h1>Online Book Store</h1>
        <p>Your gateway to unlimited learning and entertainment!</p>
      </header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/bestsellers">Best Sellers</Link>
        <Link to="/newarrivals">New Arrivals</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/bestsellers" element={<BestSellers />} />
        <Route path="/newarrivals" element={<NewArrivals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <footer>
        © 2025 Online Book Store.
      </footer>
    </BrowserRouter>
  );
}

export default App;
