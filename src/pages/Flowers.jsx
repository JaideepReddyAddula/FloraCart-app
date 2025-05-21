import { useEffect, useState } from 'react';
import axios from 'axios';

function Flowers({ currentUser, setCurrentUser }) {
  const [flowers, setFlowers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchFlowers = async () => {
    try {
      const response = await axios('https://floracart-backend.onrender.com/flowers');
      setFlowers(response.data);
      fetchUserCart(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserCart = async (allFlowers) => {
    try {
      if (!currentUser) return;
      const userRes = await axios.get(`https://floracart-backend.onrender.com/users/${currentUser.id}`);
      const userCart = userRes.data.cart || [];

      const updatedFlowers = allFlowers.map((flower) => {
        const cartItem = userCart.find(item => item.productId === flower.id);
        if (cartItem) {
          return {
            ...flower,
            isFlowerInCart: true,
            quantity: cartItem.quantity,
            cartId: cartItem.id,
          };
        } else {
          return { ...flower, isFlowerInCart: false, quantity: 0 };
        }
      });

      setFlowers(updatedFlowers);
      setCurrentUser(prev => ({ ...prev, cart: userCart }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, [currentUser]);

  const generateCartItemId = () => Math.random().toString(36).substring(2, 8);

  const addToCart = async (flower) => {
    try {
      if (!currentUser) return alert('Please login to add items to cart.');

      const userRes = await axios.get(`https://floracart-backend.onrender.com/users/${currentUser.id}`);
      const userCart = userRes.data.cart || [];

      if (userCart.find(item => item.productId === flower.id)) {
        return alert('Item already in cart');
      }

      const newCartItem = {
        id: generateCartItemId(),
        productId: flower.id,
        name: flower.name,
        quantity: 1,
        imgSrc: flower.imgSrc,
        price: flower.price,
        discount: flower.discount,
      };

      const updatedCart = [...userCart, newCartItem];

      await axios.patch(`https://floracart-backend.onrender.com/users/${currentUser.id}`, { cart: updatedCart });

      alert('Added to cart');
      fetchFlowers();
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = async (flower, increment = true) => {
    try {
      if (!currentUser) return alert('Please login.');

      const userRes = await axios.get(`https://floracart-backend.onrender.com/users/${currentUser.id}`);
      const userCart = userRes.data.cart || [];

      const updatedCart = userCart.map(item => {
        if (item.id === flower.cartId) {
          let newQty = increment ? item.quantity + 1 : item.quantity - 1;
          newQty = newQty < 1 ? 1 : newQty;
          return { ...item, quantity: newQty };
        }
        return item;
      });

      await axios.patch(`https://floracart-backend.onrender.com/users/${currentUser.id}`, { cart: updatedCart });

      alert('Updated item successfully');
      fetchFlowers();
    } catch (error) {
      console.error(error);
    }
  };

  const getDiscountedPrice = (flower) => {
    return (flower.price - (flower.price * flower.discount) / 100).toFixed();
  };

  const categories = ['All', 'Roses', 'Tulips', 'Lilies', 'Sunflowers', 'Orchids'];

  const filteredFlowers = selectedCategory === 'All'
    ? flowers
    : flowers.filter(flower => flower.category === selectedCategory);

  return (
    <div>
      <h1 className="text-center text-4xl font-bold text-pink-700 mb-6 mt-20">Flowers</h1>

      <div className="flex justify-center mb-8 gap-4 flex-wrap px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white'
                : 'bg-white text-pink-600 border-pink-600'
            } hover:bg-pink-500 hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div id="flowers" className="flex gap-10 flex-wrap justify-center mb-12">
        {filteredFlowers.map((flower) => (
          <div
            key={flower.id}
            className="bg-white shadow-md rounded-2xl p-4 w-72 flex flex-col justify-between h-[500px] hover:shadow-lg transition text-center"
          >
            <div>
              <img
                src={flower.imgSrc}
                alt={flower.name}
                className="rounded-xl h-60 w-full object-cover mb-3"
              />
              <p className="font-semibold text-lg text-pink-700">{flower.name}</p>
              <p className="text-sm text-gray-600 mb-1 h-[40px] overflow-hidden">{flower.description}</p>
              <p className="bg-green-100 text-green-700 w-fit mx-auto mt-2 rounded-full px-3 py-1 text-sm font-medium">
                <span className="border-r border-green-600 pe-1">
                  {flower.avgRating}
                  <i className="fa-solid fa-star text-yellow-400 text-md ms-1"></i>
                </span>
                <span className="pl-2">{flower.ratingCount}k</span>
              </p>
              <p className="mt-2">
                <span className="text-lg font-bold text-gray-800">₹{getDiscountedPrice(flower)}</span>
                <span className="ml-2 line-through text-gray-400">₹{flower.price}</span>
                <span className="ml-2 text-pink-600 font-medium">({flower.discount}% OFF)</span>
              </p>
            </div>

            {flower.isFlowerInCart ? (
              <div className="border border-gray-300 rounded-lg flex justify-between py-1 px-2 w-30 items-center my-2">
                <i
                  className="fa-solid fa-minus text-pink-600 cursor-pointer"
                  onClick={() => updateQuantity(flower, false)}
                ></i>
                <span>{flower.quantity}</span>
                <i
                  className="fa-solid fa-plus text-pink-600 cursor-pointer"
                  onClick={() => updateQuantity(flower, true)}
                ></i>
              </div>
            ) : (
              <button
                onClick={() => addToCart(flower)}
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-5 mt-4 rounded-xl w-full transition cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flowers;
