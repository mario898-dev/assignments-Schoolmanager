import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import API from '../api/API.mjs';
import HomePage from '../pages/Home';  
import TeacherPage from '../pages/TeacherPage';
import StudentPage from '../pages/StudentPage';

function SchoolManager() {
  const [user, setUser] = useState(undefined);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const u = await API.getUserInfo();
      setUser(u);
      setIsLoaded(true);

      // Redirect in base al ruolo
      if (u.role === 'teacher') {
        navigate('/teacher');
      } else if (u.role === 'student') {
        navigate('/student');
      } else {
        navigate('/home');
      }

    } catch {
      setUser(undefined);
      setIsLoaded(true);
      navigate('/home'); // fallback se non loggato
    }
  };

  checkAuth();
}, []);


  const doLogin = (username, password) => {
    API.login(username, password)
      .then((u) => {
       setUser(u);
       setIsLoaded(true);

      if (u.role === 'teacher')
        navigate('/teacher');
      else if (u.role === 'student')
        navigate('/student');
      else
        navigate('/home');  // fallback
})
      .catch((err) => {
        const msg = err?.error || err?.message || 'Errore durante il login';
        setLoginMessage(msg);
      });
  };

  const doLogout = async () => {
    await API.logOut();
    setUser(undefined);
    setIsLoaded(false);
    navigate('/');
  };

  // Blocca il render finché il check iniziale non è completato
  if (!isLoaded) {
    return (
      <Container className="text-center mt-5">
        <h5>Caricamento...</h5>
      </Container>
    );
  }

  return (
    <Container fluid style={{ padding: 0, height: '100%' }}>
      <Routes>
        {/* redirect iniziale */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* homepage pubblica + login integrato */}
        <Route path="/home" element={
          <HomePage
            user={user}
            onLogin={doLogin}
            onLogout={doLogout}
            message={loginMessage}
            clearMessage={setLoginMessage}
          />
        } />

        {/* aree protette */}
        <Route path="/teacher"
          element={user?.role === 'teacher' ? <TeacherPage /> : <Navigate to="/home" />}
        />

        <Route path="/student"
          element={user?.role === 'student' ? <StudentPage /> : <Navigate to="/home" />}
        />
      </Routes>
    </Container>
  );
}

export default SchoolManager;
