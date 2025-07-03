import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import API from '../api/API.mjs';
import HomePage from '../pages/Home';
import NuovoCompito from '../pages/Teacher/NuovoCompito';
import CompitiAssegnati from '../pages/Student/CompitiAssegnati';
import ValutaCompito from '../pages/Teacher/ValutaCompito';
import StatoClasse from '../pages/Teacher/StatoClasse';
import PunteggiStudent from '../pages/Student/PunteggiStudent';
import TeacherHome from '../pages/Teacher/TeacherHome';
import StudentHome from '../pages/Student/StudentHome';
import DefaultLayout from './defaultLayaout';
import PageNotFound from '../pages/PageNotFound';

function SchoolManager() {
  const [user, setUser] = useState(undefined);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  // Ripristina utente da sessione al caricamento
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await API.getUserInfo();
        setUser(u);
      } catch {
        setUser(undefined);
      } finally {
        setIsLoaded(true);
      }
    };

    checkAuth();
  }, []);

  const doLogin = async (username, password) => {
    try {
      const u = await API.login(username, password);
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
          navigate('/');
      }
    } catch (err) {
      setLoginMessage("Errore durante il login");
    }
  };


  const doLogout = async () => {
    await API.logOut();
    setUser(undefined);
    navigate('/');
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
        {/* Home */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'teacher' ? (
                <Navigate to="/teacher" replace />
              ) : (
                <Navigate to="/student" replace />
              )
            ) : (
              <HomePage
                user={user}
                onLogin={doLogin}
                onLogout={doLogout}
                message={loginMessage}
                clearMessage={setLoginMessage}
              />
            )
          }
        />


        {/* Layout protetto con navbar */}
        <Route element={<DefaultLayout user={user} onLogout={doLogout} />}>
          {/* Area Docente */}
          <Route
            path="/teacher"
            element={
              user?.role === 'teacher' ? (
                <TeacherHome user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/teacher/nuovo-compito"
            element={
              user?.role === 'teacher' ? (
                <NuovoCompito user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/teacher/valuta-compiti"
            element={
              user?.role === 'teacher' ? (
                <ValutaCompito user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/teacher/stato-classe"
            element={
              user?.role === 'teacher' ? (
                <StatoClasse user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Area Studente */}
          <Route
            path="/student"
            element={
              user?.role === 'student' ? (
                <StudentHome user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student/compiti"
            element={
              user?.role === 'student' ? (
                <CompitiAssegnati user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student/punteggi"
            element={
              user?.role === 'student' ? (
                <PunteggiStudent user={user} onLogout={doLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Container>
  );
}

export default SchoolManager;
