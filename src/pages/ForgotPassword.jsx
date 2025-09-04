import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to send reset link');
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {submitted ? (
          <p className="text-green-600 text-center">If this email is valid, a reset link will be sent.</p>
        ) : (
          <>
            <label className="block mb-2">Enter your email</label>
            <input type="email" className="w-full mb-6 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required/>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Send Reset Link</button>
          </>
        )}
      </form>
    </div>
  );
}
export default ForgotPassword;