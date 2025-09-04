import React, { useEffect, useState } from 'react';
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





}