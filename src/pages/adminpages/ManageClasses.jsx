import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const token = localStorage.getItem('token'); //get token from local storage for authentication

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
        setSelectedClass({ ...cls});
        setShowModal(true);
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

}