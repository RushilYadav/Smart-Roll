import React from 'react';

function Landing() {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4'>
            <h1 className='text-5xl font-bold mb-6 text-gray-800'>Smart Roll</h1>
            <p className='text-lg text-gray-600 mb-8'>Welcome to Smart Roll - smart attendance made simple</p>
            <button
                className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition'
                onClick={() => window.location.href = '/login'}
            >
                Log In
            </button>
        </div>
    );
}

export default Landing;