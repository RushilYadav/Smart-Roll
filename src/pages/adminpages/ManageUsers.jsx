import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    dob: '',
    profile_pic_url: '',
    password: ''
  });

  const token = localStorage.getItem('token');

  // Fetch all users
  useEffect(() => {
    fetch('http://localhost:5000/users/all', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        alert('Could not load users');
      });
  }, [token]);

  // Filter users based on search & role
  useEffect(() => {
    let filtered = [...users];
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterRole) {
      filtered = filtered.filter((u) => u.role === filterRole);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const handleRowClick = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? data.user : u))
      );
      setShowModal(false);
      alert('User updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowModal(false);
      setConfirmDelete(false);
      alert('User deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const handleNewChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setUsers((prev) => [...prev, data.user]);
      setShowAddModal(false);
      // Reset fields after creating
      setNewUser({ name: '', email: '', role: 'Student', dob: '', profile_pic_url: '', password: '' });
      alert('User created successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to create user');
    }
  };

  return (
    <div className="p-6">
      {/* Top bar with title and buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-center flex-1">Manage Users</h2>
        <button
          onClick={() => {
            setNewUser({ name: '', email: '', role: 'Student', dob: '', profile_pic_url: '', password: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add User
          </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input type="text" placeholder="Search by name or email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 rounded flex-1 min-w-[200px]"/>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-2 rounded">
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
      </div>

      {/* Users Table */}
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t cursor-pointer hover:bg-gray-50" onClick={() => handleRowClick(user)}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : '-'}</td>
                <td className="px-6 py-4">
                  {user.profile_pic_url ? (
                    <img src={user.profile_pic_url} alt="Profile" className="w-10 h-10 rounded-full" />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Delete Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <div className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Name" value={selectedUser.name} onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="email" name="email" placeholder="Email" value={selectedUser.email} onChange={handleChange} className="border p-2 rounded w-full" />
              <select name="role" value={selectedUser.role} onChange={handleChange} className="border p-2 rounded w-full">
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
              <input type="date" name="dob" value={selectedUser.dob ? selectedUser.dob.split('T')[0] : ''} onChange={handleChange} className="border p-2 rounded w-full" />
              <input type="text" name="profile_pic_url" placeholder="Profile Picture URL" value={selectedUser.profile_pic_url || ''} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              {!confirmDelete ? (
                <>
                  <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                  <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                </>
              ) : (
                <>
                  <span className="text-red-600 font-medium">Are you sure?</span>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
                  <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 border rounded hover:bg-gray-100">No</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
            <div className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Name" value={newUser.name} onChange={handleNewChange} className="border p-2 rounded w-full" autoComplete="off" />
              <input type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleNewChange} className="border p-2 rounded w-full" autoComplete="off" />
              <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleNewChange} className="border p-2 rounded w-full" autoComplete="new-password" />
              <select name="role" value={newUser.role} onChange={handleNewChange} className="border p-2 rounded w-full">
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
              <input type="date" name="dob" value={newUser.dob} onChange={handleNewChange} className="border p-2 rounded w-full" />
              <input type="text" name="profile_pic_url" placeholder="Profile Picture URL" value={newUser.profile_pic_url} onChange={handleNewChange} className="border p-2 rounded w-full" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ManageUsers;