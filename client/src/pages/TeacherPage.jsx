import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';

function TeacherPage({ user, onLogout }) {
  return (
    <>
      <AppNavbar user={user} onLogout={onLogout} />
      <Outlet />
    </>
  );
}

export default TeacherPage;
