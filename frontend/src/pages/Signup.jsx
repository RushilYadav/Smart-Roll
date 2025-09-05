import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Signup failed');
        return;
      }

      alert('Signup successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

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

        <label className="block mb-2">Confirm Password</label>
        <input
          type="password"
          className="w-full mb-6 p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
