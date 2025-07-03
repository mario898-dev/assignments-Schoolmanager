import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';

function DefaultLayout({ user, onLogout }) {
  return (
    <>
      <AppNavbar user={user} onLogout={onLogout} />
      <Outlet />
    </>
  );
}

export default DefaultLayout;