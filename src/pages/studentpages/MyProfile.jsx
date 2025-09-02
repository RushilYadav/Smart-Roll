import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentProfile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authorized. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/students/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch profile");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStudent(data);
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Something went wrong.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-12 flex justify-center">
      <div className="w-full max-w-4xl relative">

        {/* Back to Dashboard button */}
        <button
          onClick={() => navigate("/student/dashboard")}
          className="mb-6 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 font-semibold"
        >
          Back to Dashboard
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center">Student Profile</h1>

        {/* Two-column layout */}
        <div className="bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Left column: Profile picture */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            {student.profile_pic_url ? (
              <img
                src={student.profile_pic_url}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>

          {/* Right column: Info */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-2xl font-bold">{student.name}</p>
            <p><span className="font-semibold">Email:</span> {student.email}</p>
            <p><span className="font-semibold">Role:</span> {student.role}</p>
            {student.dob && (
              <p><span className="font-semibold">Date of Birth:</span> {new Date(student.dob).toLocaleDateString()}</p>
            )}

            {/* Placeholder sections for future data */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Classes</h3>
                <p>—</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Subjects</h3>
                <p>—</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
