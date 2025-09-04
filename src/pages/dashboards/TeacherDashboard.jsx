import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem('userName') || 'Teacher';
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);

    const sections = [
        {
            title: 'My Profile',
            description: 'View your personal details.',
            icon: '👤',
            link: '/teacher/profile'
        },
        {
            title: 'My Students',
            description: 'View your students, their attendance, and add grades.',
            icon: '👥',
            link: '/teacher/students'
        },
        {
            title: 'Attendance Tools',
            description: 'Take attendance and view attendance registers.',
            icon: '📅',
            link: '/teacher/attendance'
        },
        {
            title: 'View Analytics',
            description: 'Visualise attendance trends and export data.',
            icon: '📊',
            link: '/teacher/analytics'
        },
        {
            title: 'Help',
            description: 'Click if you need assistance with anything.',
            icon: 'ℹ️',
            link: '/teacher/help'
        },
        {
            title: 'Report Issue',
            description: 'Send a message to the admin to report a problem.',
            icon: '🛠',
            link: '/teacher/report-issue'
        }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6 relative'>
            <div className='absolute top-6 right-6'>
                <button 
                    onClick={() => setShowConfirmLogout(true)} 
                    className='text-red-600 font-medium hover:underline text-xl mr-3 mt-2'>
                    Log Out
                </button>
            </div>

            {showConfirmLogout && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
                    <div className='bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center'>
                        <h2 className='text-2xl font-semibold mb-4'>Log Out</h2>
                        <p className='mb-6'>Are you sure you want to log out?</p>
                        <div className='flex justify-center gap-4'>
                            <button 
                                onClick={handleLogout} 
                                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>
                                Yes
                            </button>
                            <button 
                                onClick={() => setShowConfirmLogout(false)} 
                                className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h1 className='text-4xl font-bold text-left mb-8 mt-2 ml-3'>Teacher Dashboard</h1>
            <h1 className='text-4xl text-center mb-3'>Welcome back {name}!</h1>
            <p className='text-center text-gray-600 mb-12 text-xl'>What would you like to do today?</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto'>
                {sections.map((section, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(section.link)}
                        className='cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition mb-5'
                    >
                        <div className='text-3xl mb-4'>{section.icon} {section.title}</div>
                        <p className='text-gray-600'>{section.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeacherDashboard;
