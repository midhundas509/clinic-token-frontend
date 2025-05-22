import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import logo from '../assets/hospital-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Clinic Logo" className="navbar-logo-img" />
          <span>Clinic Token System</span>
        </Link>
      </div>
      
      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-menu" 
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
      
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/doctor" onClick={() => setIsMenuOpen(false)}>Doctor Login</Link>
        <Link to="/reception" onClick={() => setIsMenuOpen(false)}>Reception Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;