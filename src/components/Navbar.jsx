import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar({ currentUser, setCurrentUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('floracartUser');
    setCurrentUser(null);

    setIsMenuOpen(false);

    navigate('/', { replace: true });
  };

  return (
    <header className="bg-pink-100 shadow p-4 fixed w-full z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img className="w-13 h-10" src="cart0.png" alt="FloraCart Logo" />
          <h1 className="text-2xl font-bold text-pink-600">FloraCart</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
          <Link to="/" className="hover:text-pink-600">Home</Link>
          <button onClick={() => handleScroll('about')} className="hover:text-pink-600">About</button>
          <Link to="/Flowers" className="hover:text-pink-600">Shop</Link>
          <Link to="/cart" className="hover:text-pink-600">Cart</Link>
          <button onClick={() => handleScroll('footer')} className="hover:text-pink-600">Contact</button>
          {currentUser && currentUser.username ? ( 
            <>
              <span className="text-pink-600">Hello, {currentUser.username}</span>
              {/* Logout button for desktop */}
              <button onClick={handleLogout} className="hover:text-pink-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-pink-600">Login</Link>
          )}
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button
            className="text-2xl text-pink-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-pink-50 p-4 mt-2 shadow rounded-lg space-y-3 text-gray-700 font-medium text-center">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block hover:text-pink-600">Home</Link>
          <button onClick={() => handleScroll('about')} className="block w-full hover:text-pink-600">About</button>
          <Link to="/Flowers" onClick={() => setIsMenuOpen(false)} className="block hover:text-pink-600">Shop</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block hover:text-pink-600">Cart</Link>
          <button onClick={() => handleScroll('footer')} className="block w-full hover:text-pink-600">Contact</button>
          {currentUser && currentUser.username ? ( // ✅ More robust check for currentUser and its username
            <>
              <span className="block text-pink-600">Hello, {currentUser.username}</span>
              {/* Logout button for mobile */}
              <button onClick={handleLogout} className="block w-full hover:text-pink-600">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block hover:text-pink-600">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
