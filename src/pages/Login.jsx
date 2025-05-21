import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("https://floracart-backend.onrender.com/users");
      const users = res.data;

      // Find matching user
      const matchedUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (matchedUser) {
        localStorage.setItem("floracartUser", JSON.stringify(matchedUser));
        setCurrentUser(matchedUser);
        alert('Login successfull');
        navigate("/Flowers"); // or any page after login
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error", err);
    }
  };



  return (
    <div className="p-6 max-w-md mx-auto mt-20">
      <h2 className="text-2xl text-gray-700 font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
  <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none"
        required
      />
  <div className="flex justify-between items-center">
  <button
    type="submit"
    className="bg-pink-600 text-white px-4 py-2 rounded"
  >
    Login
  </button>
  <Link
    to="/forgotpassword"
    className="text-sm text-pink-600 hover:text-pink-700"
  >
    Forgot Password?
  </Link>
</div>

</form>

    </div>
  );
}

export default Login;
