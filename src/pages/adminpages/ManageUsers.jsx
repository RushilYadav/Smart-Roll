import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/users/all', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        alert('Could not load users');
      });
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">DOB</th>
              <th className="px-6 py-3 text-left">Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  {user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : '-'}
                </td>
                <td className="px-6 py-4">
                  {user.profile_pic_url ? (
                    <img
                      src={user.profile_pic_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
