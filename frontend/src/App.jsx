import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import Signup from './pages/Signup';
import ManageUsers from './pages/adminpages/ManageUsers';
import TeacherProfile from './pages/teacherpages/MyProfile';
import StudentProfile from './pages/studentpages/MyProfile';
import ManageClasses from './pages/adminpages/ManageClasses';
import MyClasses from './pages/teacherpages/MyClasses';
import Attendance from './pages/adminpages/Attendance';

function App() {
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/admin/dashboard' element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path='/teacher/dashboard' element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path='/student/dashboard' element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/admin/manage-users' element={<ProtectedRoute allowedRoles={['Admin']}><ManageUsers /></ProtectedRoute>} />
      <Route path='/teacher/profile' element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherProfile /></ProtectedRoute>} />
      <Route path='/student/profile' element={<ProtectedRoute allowedRoles={['Student']}><StudentProfile /></ProtectedRoute>} />
      <Route path='/admin/classes' element={<ProtectedRoute allowedRoles={['Admin']}><ManageClasses /></ProtectedRoute>} />
      <Route path='/teacher/classes' element={<ProtectedRoute allowedRoles={['Teacher']}><MyClasses /></ProtectedRoute>} />
      <Route path='/admin/attendance' element={<ProtectedRoute allowedRoles={['Admin']}><Attendance /></ProtectedRoute>} />
    </Routes>
  );
}
export default App;