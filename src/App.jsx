import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import Signup from './pages/Signup';
import ManageUsers from './pages/adminpages/ManageUsers';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/admin/dashboard' element={<AdminDashboard />}/>
      <Route path='/teacher/dashboard' element={<TeacherDashboard />}/>
      <Route path='/student/dashboard' element={<StudentDashboard />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/admin/manage-users' element={<ManageUsers />}/>
    </Routes>
  );
}

export default App;