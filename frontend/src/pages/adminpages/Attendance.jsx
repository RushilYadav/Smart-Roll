import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import e from "cors";

function Attendance() {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/classes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const classNoStudents = response.data.map((cls) => ({ ...cls, students: [] }));
                setClasses(classNoStudents);
                setFilteredClasses(classNoStudents);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError("Failed to fetch classes");
            }
        };
        fetchClasses();
    }, [token]);

    const fetchStudents = async (cls) => {
        setSelectedClass(cls);
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`http://localhost:5000/teacher/classes/${cls.id}/students`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data);
            setAttendance(true);

            setClasses((prevClasses) =>
                prevClasses.map((c) =>
                    c.id === cls.id ? { ...c, students: response.data } : c
                )
            );
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm) {
            setFilteredClasses(classes);
            return;
        }
        const search = searchTerm.toLowerCase();
        const filtered = classes.filter(cls => {
            if (cls.name.toLowerCase().includes(search)) return true;
            if (cls.students.some(student => student.name.toLowerCase().includes(search))) return true;
            return false;
        });
        setFilteredClasses(filtered);
    }, [searchTerm, classes]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-center flex-1">Attendance</h2>
                <div className="w-32" />
            </div>

            {/* Search Bar */}
            {!attendance && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by class name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded w-full max-w-md"
                    />
                </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}


            {/* Classes table */}
            {!attendance && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md border rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border text-center">Class Name</th>
                                <th className="py-2 px-4 border text-center">Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((cls) => (
                                <tr
                                    key={cls.id}
                                    className="border-t cursor-pointer hover:bg-gray-50"
                                    onClick={() => fetchStudents(cls)}
                                >
                                    <td className="py-2 px-4 border text-center">{cls.name}</td>
                                    <td className="py-2 px-4 border text-center">{cls.teacherName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Student table */}
            {attendance && selectedClass && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold">Attendance for {selectedClass.name}</h3>
                        <button
                            onClick={() => setAttendance(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Back to Classes
                        </button>
                    </div>

                {loading ? (
                    <p>Loading students...</p>
                ) : students.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md border rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 border text-center">Student Name</th>
                                    <th className="py-2 px-4 border text-center">Email</th>
                                    <th className="py-2 px-4 border text-center">Present</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-t hover:bg-gray-50">
                                        <td className="py-2 px-4 border text-center">{student.name}</td>
                                        <td className="py-2 px-4 border text-center">{student.email}</td>
                                        <td className="py-2 px-4 border text-center">
                                            <input type="checkbox" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No students found.</p>
                )}

                {/* Facial Recognition button */}
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Start Facial Recognition
                </button>
            </div>
        )}
        </div>
    );
}
export default Attendance;