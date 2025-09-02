import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data);
        alert(data.error || 'Login failed');
        return;
      }

      // Save token and role
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // Navigate based on user role
      if (data.user.role === 'Admin') navigate('/admin/dashboard');
      else if (data.user.role === 'Teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <div className="text-sm text-center mt-4">
          <a href="/signup" className="text-blue-600 hover:underline ml-0">
            Signup
          </a>
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline ml-5"
          >
            Forgot Password
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
