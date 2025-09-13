import React, { useEffect, useState } from "react";

function Attendance() {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/classes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setClasses(data);
            })
            .catch((error) => {
                console.error("Error fetching classes:", error);
            });
    }, [token]);

    const handleSelectedClass = async (cls) => {
        setSelectedClass(cls);
        try {
            const response = await fetch(`http://localhost:5000/teacher/classes/${cls.id}/students`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setStudents(data);
            setAttendance(true);
        } catch (error) {
            console.error("Error fetching students:", error);
            alert("Error fetching students");
        }   
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Attendance</h2>

        </div>


    );
}
export default Attendance;