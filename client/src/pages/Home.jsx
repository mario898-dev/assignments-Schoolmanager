import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../components/Login';

export default function HomePage({ user, onLogin, message, clearMessage }) {
  if (user) return null;

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100" style={{ maxWidth: '1100px' }}>
        {/* Colonna sinistra - Box informativi */}
        <Col md={6} className="d-flex flex-column justify-content-center gap-3">
          <div className="bg-light p-4 rounded shadow-sm">
            <h5 className="fw-bold">SchoolManager</h5>
            <p className="text-muted mb-0">
              SchoolManager permette di gestire compiti, risposte e valutazioni in base al tuo ruolo.
              Dopo il login verrai indirizzato automaticamente alla tua area personale.
            </p>
          </div>

          <div className="bg-light p-4 rounded shadow-sm">
            <h5 className="fw-bold">Area Docente</h5>
            <p className="text-muted mb-0">
              Offre un'area docente personalizzata.
            </p>
          </div>

          <div className="bg-light p-4 rounded shadow-sm">
            <h5 className="fw-bold">Area Studente</h5>
            <p className="text-muted mb-0">
              Offre un'area studente personalizzata.
            </p>
          </div>
        </Col>

        {/* Colonna destra - Login */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <Login onLogin={onLogin} message={message} clearMessage={clearMessage} />
        </Col>
      </Row>
    </Container>
  );
}

