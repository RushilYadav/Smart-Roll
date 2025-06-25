import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/admin/dashboard' element={<AdminDashboard />}/>
      <Route path='/teacher/dashboard' element={<TeacherDashboard />}/>
    </Routes>
  );
}

export default App;