import React, { use, useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with:', email, password);
        // TODO: backend email and password
    };

    return (
        <div className='min-h-screen flex justify-center items-center bg-gray-100'>
            <form onSubmit={handleLogin} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

                <label className='block mb-2'>Email</label>
                <input
                    type='email'
                    className='w-full mb-4 p-2 border rounded'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />

                <label className='block mb-2'>Password</label>
                <input
                    type='password'
                    className='w-full mb-4 p-2 border rounded'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />

                <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>Log In</button>

                <div className='text-sm text-center mt-4'>
                    <a href="/forgot-password" className='text-blue-600 hover:underline ml-2'>Forgot Password</a>
                </div>
            </form>
        </div>
    );
}

export default Login;