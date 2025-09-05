import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function MyClasses() {
    const [classes, setClasses] = useState([]); //store classes
    const [selectedClass, setSelectedClass] = useState(null); //store selected class
    const [students, setStudents] = useState([]); //store students in selected class
    const [loading, setLoading] = useState(false); //loading state
    const [error, setError] = useState(""); //error state
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);

    const token = localStorage.getItem("token");
    
    //fetch classes for the logged-in teacher
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/teacher/classes", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const classesStudents = response.data.map((cls) => ({ ...cls, students: [] }));
                setClasses(classesStudents);
                setFilteredClasses(classesStudents);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError("Failed to fetch classes");
            }
        };
        fetchClasses();
    }, [token]);

    //fetch students when a class is selected
    const fetchStudents = async (classId) => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5000/teacher/classes/${classId}/students`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data);
            setSelectedClass(classId);

            //update the classes state to include students for the selected class
            setClasses((prevClasses) =>
                prevClasses.map((cls) =>
                    cls.id === classId ? { ...cls, students: response.data } : cls
                )
            );

        } catch (err) {
            console.error("Error fetching students:", err);
            setError("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    //filter classes based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredClasses(classes);
            return;
        }
        const search = searchTerm.toLowerCase();
        const filtered = classes.filter((cls) => {
            if (cls.name.toLowerCase().includes(search)) return true;
            if (cls.students.some((student) => student.name.toLowerCase().includes(search))) return true;
            return false;
        });
        setFilteredClasses(filtered);
    }, [searchTerm, classes]);

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <button
                    onClick={() => navigate("/teacher/dashboard")}
                    className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'>
                    Back to Dashboard
                </button>
                <h2 className='text-3xl font-bold text-center flex-1'>My Classes</h2>
                <div className='w-32'/>
            </div>

            {/* Search Bar */}
            <div className='mb-4'>
                <input
                    type="text"
                    placeholder="Search by class or student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border p-2 rounded w-full max-w-md'
                />
            </div>

            {error && <p className='text-red-500 mb-4'>{error}</p>}

            {/* Classes Table */}
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white shadow-md border rounded-lg overflow-hidden'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-6 py-3 text-left'>Class Name</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredClasses.map((cls) => (
                            <tr
                                key={cls.id}
                                className='border-t cursor-pointer hover:bg-gray-50'
                                onClick={() => fetchStudents(cls.id)}
                            >
                                <td className='px-6 py-4'>{cls.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Students Table */}
            {selectedClass && (
                <div className='mt-6'>
                    <h3 className='text-2xl font-semibold mb-3'>Students in {classes.find(c => c.id === selectedClass)?.name}</h3>

                    {loading ? (
                        <p>Loading students...</p>
                    ) : students.length > 0 ? (
                        <div className='overflow-x-auto'>
                            <table className='min-w-full bg-white shadow-md border rounded-lg overflow-hidden'>
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th className='px-6 py-3 text-left'>Student Name</th>
                                        <th className='px-6 py-3 text-left'>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className='border-t hover:bg-gray-50'>
                                            <td className='px-6 py-4'>{student.name}</td>
                                            <td className='px-6 py-4'>{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No students found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
export default MyClasses;