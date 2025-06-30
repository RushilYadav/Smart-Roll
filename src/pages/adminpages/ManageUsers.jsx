import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ManageUsers() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/users/all')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => {
            console.error('Failed to fetch users:', err)
            alert('Could not load users')
        })
    }, [])
    





    return (
        <div className='p-6'>
            <button onClick={() => navigate('/admin/dashboard')} className='mb-4 text-blue-600 hover:underline flex items-centre'>Back to Dashboard</button>

            <h2 className='text-3xl font-bold mb-6'>Manage Users</h2>

            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white shadow-md border rounded-lg overflow-hidden'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-left'>Name</th>
                            <th className='px-6 py-3 text-left'>Email</th>
                            <th className='px-6 py-3 text-left'>Role</th>
                            <th className='px-6 py-3 text-left'>DOB</th>
                            <th className='px-6 py-3 text-left'>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={idx} className='border-t'>
                                <td className='px-6 py-4'>{user.name}</td>
                                <td className='px-6 py-4'>{user.email}</td>
                                <td className='px-6 py-4'>{user.role}</td>
                                <td className='px-6 py-4'>{user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-GB') : '-'}</td>
                                <td className='px-6 py-4'>{user.address || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default ManageUsers;