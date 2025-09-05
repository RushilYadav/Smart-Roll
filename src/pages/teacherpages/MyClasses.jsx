import React, { useEffect, useState } from "react";
import axios from "axios";


function MyClasses() {
    const [classes, setClasses] = useState([]); //store classes
    const [selectedClass, setSelectedClass] = useState(null); //store selected class
    const [students, setStudents] = useState([]); //store students in selected class
    const [loading, setLoading] = useState(false); //loading state
    const [error, setError] = useState(""); //error state

    //fetch classes for the logged-in teacher
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/teacher/classes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClasses(response.data);
            } catch (err) {
                console.error("Error fetching classes:", err);
                setError("Failed to fetch classes");
            }
        };
        fetchClasses();
    }, []);

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
        } catch (err) {
            console.error("Error fetching students:", err);
            setError("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Classes</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* List of classes */}
            <ul>
                {classes.map((cls) => (
                    <li
                        key={cls.id}
                        onClick={() => fetchStudents(cls.id)}
                        style={{
                            cursor: "pointer",
                            fontWeight: selectedClass === cls.id ? "bold" : "normal",
                            marginBottom: "5px",
                        }}
                    >
                        {cls.name}
                    </li>
                ))}
            </ul>

            {/* Students in the selected class */}
            {selectedClass && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Students in {classes.find((cls) => cls.id === selectedClass)?.name}</h3>

                    {loading ? (
                        <p>Loading students...</p>
                    ) : students.length > 0 ? (
                        <ul>
                            {students.map((student) => (
                                <li key={student.id}>{student.name} ({student.email})</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No students enrolled in this class.</p>
                    )}
                </div>
            )}
        </div>
    );
}
export default MyClasses;