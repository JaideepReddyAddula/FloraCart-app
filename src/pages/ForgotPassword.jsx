import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`https://floracart-backend.onrender.com/users?email=${email}`);
      if (res.data.length > 0) {
        setUserFound(res.data[0]); // User found
        setMessage('');
      } else {
        setMessage('No user found with this email.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://floracart-backend.onrender.com/users/${userFound.id}`, {
        password: newPassword,
      });
      setMessage('Password updated successfully. You can now log in.');
      setUserFound(null);
      setEmail('');
      setNewPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded p-6">
      <h2 className="text-xl font-bold text-pink-600 mb-4">Forgot Password</h2>

      {!userFound ? (
        <form onSubmit={handleEmailSubmit}>
          <label className="block mb-2 text-sm text-gray-600">Enter your email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Submit</button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <label className="block mb-2 text-sm text-gray-600">Enter new password for {userFound.username}</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Reset Password</button>
        </form>
      )}

      {message && <p className="text-sm text-center mt-4 text-blue-600">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
