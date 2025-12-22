import React, { useState } from 'react';

// Hard‑coded admin credentials
const ADMIN_USERS = [
  { username: 'rashagan', password: 'rhynoxadmins' },
  { username: 'martin', password: 'rhynoxadmins' },
  { username: 'thols', password: 'rhynoxadmins' },
  { username: 'navil', password: 'rhynoxadmins' },
];

/**
 * AdminLogin – simple login form for admin users.
 * Calls `onSuccess` when credentials match.
 */
const AdminLogin = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = ADMIN_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (match) {
      setError('');
      onSuccess(match);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <section
      id="admin-login"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 text-white p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && (
          <p className="text-red-500 text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label className="block mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Sign In
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;
