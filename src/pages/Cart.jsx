import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Cart({ currentUser, setCurrentUser }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchUserCart = async () => {
    try {
      if (!currentUser) return;
      const userRes = await axios.get(`https://floracart-backend.onrender.com/users/${currentUser.id}`);
      const userCart = userRes.data.cart || [];
      setCart(userCart);
      setCurrentUser(prev => ({ ...prev, cart: userCart }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [currentUser]);

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    } else {
      alert('Your cart is empty.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!currentUser) return alert('Please login.');
    const updatedCart = cart.filter(item => item.id !== cartItemId);
    await axios.patch(`https://floracart-backend.onrender.com/users/${currentUser.id}`, { cart: updatedCart });
    fetchUserCart();
  };

  const updateQuantity = async (cartItemId, increment = true) => {
    if (!currentUser) return alert('Please login.');
    const updatedCart = cart.map(item => {
      if (item.id === cartItemId) {
        let newQty = increment ? item.quantity + 1 : item.quantity - 1;
        newQty = Math.max(newQty, 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    await axios.patch(`https://floracart-backend.onrender.com/users/${currentUser.id}`, { cart: updatedCart });
    fetchUserCart();
  };

  const getDiscountedPrice = (item) => {
    return (item.price - (item.price * item.discount) / 100).toFixed(2);
  };

  const getTotalAmount = () => {
    return cart.reduce((acc, item) => acc + item.quantity * getDiscountedPrice(item), 0).toFixed(2);
  };


  return (
    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 mt-20">
      <h2 className="text-2xl text-pink-700 font-bold mb-6 text-center">
        <i className="fa-solid fa-cart-shopping text-pink-600 me-2"></i>Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
        {/* Cart Items */}
        <div className="space-y-6 lg:w-2/3">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center border-b p-4 shadow-md rounded-md">
              <img src={item.imgSrc} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="sm:ml-4 mt-2 sm:mt-0 flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.category || 'Flower'}</p>
                <p className="text-gray-900 font-semibold">
                  ₹ {getDiscountedPrice(item)}{' '}
                  <span className="line-through text-gray-400 text-sm">₹{item.price}</span>
                </p>
              </div>
              <div className="flex items-center mt-2 sm:mt-0 border rounded-md">
                <button
                  disabled={item.quantity === 1}
                  className="px-3 py-1 text-pink-600 hover:text-pink-700"
                  onClick={() => updateQuantity(item.id, false)}
                >−</button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button
                  className="px-3 py-1 text-pink-600 hover:text-pink-700"
                  onClick={() => updateQuantity(item.id, true)}
                >+</button>
              </div>
              <button
                className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-red-500 hover:text-red-600"
                onClick={() => removeFromCart(item.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg lg:w-1/3">
          <h3 className="text-lg text-gray-700 font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{getTotalAmount()}</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <span>Shipping estimate</span>
            <span>₹0.00</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <span>Payment type</span>
            <span>COD</span>
          </div>
          <div className="flex justify-between font-bold text-gray-700 mt-4 text-lg">
            <span>Order Total</span>
            <span>₹{getTotalAmount()}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-pink-600 text-white py-3 mt-4 rounded-md hover:bg-pink-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
