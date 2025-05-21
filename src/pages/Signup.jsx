import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ setCurrentUser }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user already exists
      const res = await axios.get(`https://floracart-backend.onrender.com/users?email=${form.email}`);
      if (res.data.length > 0) return alert('User already exists!');

      // Create new user with empty cart
      const createRes = await axios.post('https://floracart-backend.onrender.com/users', {
        username: form.username,
        email: form.email,
        password: form.password,
        cart: [],
      });

      alert('Account created successfully');

      if (setCurrentUser) {
        setCurrentUser(createRes.data); // auto-login new user
        navigate('/Flowers');
      } else {
        navigate('/Login');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20">
      <h2 className="text-2xl text-gray-700 font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 border focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border focus:outline-none"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
