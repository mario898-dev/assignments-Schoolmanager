import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import API from '../api/API.mjs';

import HomePage from '../pages/Home';
import TeacherPage from '../pages/TeacherPage';
import StudentPage from '../pages/StudentPage';
import NuovoCompito from '../pages/Teacher/NuovoCompito';
import CompitiAssegnati from '../pages/Student/CompitiAssegnati';
import ValutaCompito from '../pages/Teacher/ValutaCompito';
import StatoClasse from '../pages/Teacher/StatoClasse';
import PunteggiStudent from '../pages/Student/PunteggiStudent';
import TeacherHome from '../pages/Teacher/TeacherHome';
import StudentHome from '../pages/Student/StudentHome';

function SchoolManager() {
  const [user, setUser] = useState(undefined);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Verifica autenticazione al caricamento
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await API.getUserInfo();
        setUser(u);
        setIsLoaded(true);

        switch (u.role) {
          case 'teacher':
            navigate('/teacher');
            break;
          case 'student':
            navigate('/student');
            break;
          default:
            navigate('/home');
        }
      } catch {
        setUser(undefined);
        setIsLoaded(true);
        navigate('/home');
      }
    };

    checkAuth();
  }, []);

  const doLogin = (username, password) => {
    API.login(username, password)
      .then((u) => {
        setUser(u);
        setIsLoaded(true);

        switch (u.role) {
          case 'teacher':
            navigate('/teacher');
            break;
          case 'student':
            navigate('/student');
            break;
          default:
            navigate('/home');
        }
      })
      .catch((err) => {
        const msg = err?.error || err?.message || 'Errore durante il login';
        setLoginMessage(msg);
      });
  };

  const doLogout = async () => {
    await API.logOut();
    setUser(undefined);
    navigate('/home');
  };

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
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Home Page */}
        <Route
          path="/home"
          element={
            <HomePage
              user={user}
              onLogin={doLogin}
              onLogout={doLogout}
              message={loginMessage}
              clearMessage={setLoginMessage}
            />
          }
        />

        {/* Area Docente */}
        <Route
          path="/teacher"
          element={
            user?.role === 'teacher'
              ? <TeacherPage user={user} onLogout={doLogout} />
              : <Navigate to="/home" />
          }
        >
          <Route index element={<TeacherHome user={user} />} />
          <Route path="nuovo-compito" element={<NuovoCompito user={user} onLogout={doLogout} />} />
          <Route path="valuta-compiti" element={<ValutaCompito user={user} onLogout={doLogout} />} />
          <Route path="stato-classe" element={<StatoClasse user={user} onLogout={doLogout} />} />
        </Route>

        {/* Area Studente */}
        <Route
          path="/student"
          element={
            user?.role === 'student'
              ? <StudentPage user={user} onLogout={doLogout} />
              : <Navigate to="/home" />
          }
        >
          <Route index element={<StudentHome user={user} onLogout={doLogout} />} />
          <Route path="compiti" element={<CompitiAssegnati user={user} onLogout={doLogout} />} />
          <Route path="punteggi" element={<PunteggiStudent user={user} onLogout={doLogout} />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default SchoolManager;
