import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Flowers from './pages/Flowers';
import Cart from './pages/Cart';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('floracartUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    // Optionally, navigate to login or home page after logout
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} logout={logout} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/Flowers" element={<Flowers currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/Cart" element={<Cart currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/checkout" element={<Checkout currentUser={currentUser} />} />
          <Route path="/orderconfirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
