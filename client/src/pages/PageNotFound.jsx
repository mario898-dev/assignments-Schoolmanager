import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../api/API.mjs'; 

function PageNotFound() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.getUserInfo()
      .then(user => setRole(user.role))
      .catch(() => setRole(null)); // utente non loggato o errore
  }, []);

  const handleRedirect = () => {
    if (role === 'teacher') navigate('/teacher');
    else if (role === 'student') navigate('/student');
    else navigate('/');
  };

  return (
    <Container className="text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <h3 className="mb-3">Pagina non trovata</h3>
      <p>La pagina che stai cercando non esiste o è stata rimossa.</p>

      {role && (
        <Button variant="primary" className="mt-3" onClick={handleRedirect}>
          Torna alla tua home
        </Button>
      )}
    </Container>
  );
}

export default PageNotFound;

