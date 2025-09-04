import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function ManageClasses() {
    const navigate = useNavigate(); //hook to navigate back to dashboard
    const [classes, setClasses] = useState([]); //all classes fetched from backend
    const [filteredClasses, setFilteredClasses] = useState([]); //classes after search filter
    const [searchTerm, setSearchTerm] = useState(''); //search input state
    const [selectedClass, setSelectedClass] = useState(null); //class selected for edit or delete
    const [showModal, setShowModal] = useState(false); //state to control edit modal visibility
    const [confirmDelete, setConfirmDelete] = useState(false); //state to control delete confirmation modal
    const [showAddModal, setShowAddModal] = useState(false); //state to control add class modal
    const [newClass, setNewClass] = useState({ //state for new class form
        name: '',
        teacherId: '',
        studentIds: []
    });
    const [allUsers, setAllUsers] = useState([]); //all users for dropdowns

    const token = localStorage.getItem('token'); //get token from local storage for authentication

    //fetch all users for teacher/student dropdowns
    useEffect(() => {
        fetch('http://localhost:5000/users/all', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setAllUsers(data))
            .catch((error) => {
                console.error('Failed to fetch users:', error);
                alert('Could not load users for dropdowns');
            });
    }, [token]);

    //fetch all classes from backend
    useEffect(() => {
        fetch('http://localhost:5000/classes', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setClasses(data); //store all classes
                setFilteredClasses(data); //initialize filtered classes
            })
            .catch((error) => {
                console.error('Failed to fetch classes:', error);
                alert('Could not load classes');
            });
    }, [token]);

    //filter classes based on search term
    useEffect(() => {
        let filtered = [...classes];
        if (searchTerm) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.teacher && u.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredClasses(filtered); //update the filtered list
    }, [searchTerm, classes]);

    //handle click on class row to edit
    const handleRowClick = (cls) => {

        const teacherId = cls.teacherId ? cls.teacherId : null;
        const studentIds = cls.students ? cls.students.map((s) => s.id) : [];


        setSelectedClass({
            id: cls.id,
            name: cls.name,
            teacherId,
            studentIds,
        });
        setShowModal(true);
    }

    //update state for edit class form inputs
    const handleClassChange = (e) => {
        setSelectedClass({ ...selectedClass, [e.target.name]: e.target.value });
    }

    //save updated class details to backend
    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/classes/${selectedClass.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(selectedClass),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update class');

            setClasses((prev) =>
                prev.map((cls) => (cls.id === selectedClass.id ? data.class : cls))
            );
            setShowModal(false);
            alert('Class updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update class');
        }        
    }

    //delete class from backend
    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/classes/${selectedClass.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete class');

            //remove class from local state
            setClasses((prev) => prev.filter((cls) => cls.id !== selectedClass.id));
            setShowModal(false);
            setConfirmDelete(false);
            alert('Class deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to delete class');
        }
    };

    //update state for new class form inputs
    const handleNewClassChange = (e) => {
        setNewClass({ ...newClass, [e.target.name]: e.target.value });
    };

    //create new class
    const handleCreateClass = async () => {
        try {
            const res = await fetch('http://localhost:5000/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newClass),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create class');

            //add new class to local state
            setClasses((prev) => [...prev, data.class]);
            setShowAddModal(false);

            //reset new class form
            setNewClass({ name: '', teacherId: '', studentIds: [] });
            alert('Class created successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to create class');
        }
    };

    return (
        <div className='p-6'>
            {/* Header and Back to Dashboard button */}
            <div className='flex justify-between items-center mb-6'>
                <button onClick={() => navigate('/admin/dashboard')} className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'>
                    Back to Dashboard
                </button>
                <h2 className='text-3xl font-bold text-center flex-1'>Manage Classes</h2>
                <button onClick={() => {
                    setNewClass({ name: '', teacherId: '', studentIds: [] });
                    setShowAddModal(true);
                }}
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                >
                Add Class
                </button>
            </div>

            {/* Search input */}
            <div className='flex gap-4 mb-4 flex-wrap'>
                <input
                    type='text'
                    placeholder='Search by class name or teacher'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border p-2 rounded flex-1 min-w-[200px]'
                />
            </div>

            {/* Classes table */}
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white shadow-md border rounded-lg overflow-hidden'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-left'>Class Name</th>
                            <th className='px-6 py-3 text-left'>Teacher</th>
                            <th className='px-6 py-3 text-left'>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.map((cls) => (
                            <tr
                                key={cls.id}
                                className='border-t cursor-pointer hover:bg-gray-50'
                                onClick={() => handleRowClick(cls)}
                            >
                                <td className='px-6 py-4'>{cls.name}</td>
                                <td className='px-6 py-4'>{cls.teacherName}</td>
                                <td className='px-6 py-4'>
                                    <select
                                        className='border p-1 rounded w-full'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {cls.students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Delete Class Modal */}
            {showModal && selectedClass && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
                    <div className='bg-white rounded-xl p-6 shadow-lg w-full max-w-md'>
                        <h2 className='text-2xl font-semibold mb-4'>Edit Class</h2>
                        <div className='flex flex-col gap-3'>

                            {/* Class Name */}
                            <input type='text' name='name' placeholder='Class Name' value={selectedClass.name} onChange={(e) => setSelectedClass({ ...selectedClass, name: e.target.value })} className='border p-2 rounded w-full' />

                            {/* Teacher Dropdown */}

                            <Select
                                options={allUsers
                                    .filter((u) => u.role === 'Teacher')
                                    .map((u) => ({ value: u.id, label: u.name }))}
                                value={
                                    selectedClass.teacherId
                                        ? allUsers
                                            .filter((u) => u.id === selectedClass.teacherId)
                                            .map((u) => ({ value: u.id, label: u.name }))[0]
                                        : null
                                }
                                onChange={(option) => 
                                    setSelectedClass({ ...selectedClass, teacherId: option.value})
                                }
                                placeholder='Select Teacher'
                            />

                            {/* Students Dropdown */}
                            <Select
                                isMulti
                                options={allUsers
                                    .filter((u) => u.role === 'Student')
                                    .map((u) => ({ value: u.id, label: u.name }))}
                                value={selectedClass.studentIds.map((id) => {
                                    const user = allUsers.find((u) => u.id === id);
                                    return user ? { value: user.id, label: user.name } : null;
                                }).filter(Boolean)}
                                onChange={(options) =>
                                    setSelectedClass({ ...selectedClass, studentIds: options.map((o) => o.value),     
                                    })
                                }
                                placeholder='Select Students'
                            />
                        </div>

                        {/* Buttons */}
                        <div className='flex justify-end gap-3 mt-4'>
                            <button
                                onClick={() => setShowModal(false)}
                                className='px-4 py-2 border rounded hover:bg-gray-100'
                            >
                                Cancel
                            </button>

                            {!confirmDelete ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                                    >
                                        Delete Class
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className='text-red-600 font-medium'>Confirm delete?</span>
                                    <button
                                        onClick={handleDelete}
                                        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className='px-4 py-2 border rounded hover:bg-gray-100'
                                    >
                                        No
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Class Modal */}
            {showAddModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
                    <div className='bg-white rounded-xl p-6 shadow-lg w-full max-w-md'>
                        <h2 className='text-2xl font-semibold mb-4'>Add New Class</h2>
                        <div className='flex flex-col gap-3'>

                            {/* Class Name */}
                            <input type='text' name='name' placeholder='Class Name' value={newClass.name} onChange={handleNewClassChange} className='border p-2 rounded w-full' autoComplete='off'/>


                            {/* Teacher Dropdown */}

                            <Select
                                options={allUsers
                                    .filter((u) => u.role === 'Teacher')
                                    .map((u) => ({ value: u.id, label: u.name }))}
                                value={
                                    newClass.teacherId
                                    ? allUsers
                                        .filter((u) => u.id === newClass.teacherId)
                                        .map((u) => ({ value: u.id, label: u.name }))[0]
                                    : null
                                }
                                onChange={(option) => 
                                    setNewClass({ ...newClass, teacherId: option.value})
                                }
                                placeholder='Select Teacher'
                            />


                            {/* Students Dropdown */}
                            <Select
                                isMulti
                                options={allUsers
                                    .filter((u) => u.role === 'Student')
                                    .map((u) => ({ value: u.id, label: u.name }))}
                                value={newClass.studentIds.map((id) => {
                                    const user = allUsers.find((u) => u.id === id);
                                    return user ? { value: user.id, label: user.name } : null;
                                }).filter(Boolean)}
                                onChange={(options) =>
                                    setNewClass({ ...newClass, studentIds: options.map((o) => o.value),
                                    })
                                }
                                placeholder='Select Students'
                            />
                        </div>

                        <div className='flex justify-end gap-3 mt-4'>
                            <button onClick={() => setShowAddModal(false)} className='px-4 py-2 border rounded hover:bg-gray-100'>Cancel</button>
                            <button onClick={handleCreateClass} className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'>Create Class</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageClasses;