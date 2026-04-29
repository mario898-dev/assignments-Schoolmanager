import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

function AppNavbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="mb-0 border-bottom">
      <Container fluid>
    
        <Navbar.Brand className="fw-bold me-auto">
          ➡️ School Manager
        </Navbar.Brand>

        <Nav className="mx-auto">
          {user?.role === 'teacher' && (
            <>
              <Nav.Link as={NavLink} to="/teacher">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/teacher/nuovo-compito">Crea Compito</Nav.Link>
              <Nav.Link as={NavLink} to="/teacher/valuta-compiti">Valuta Compiti</Nav.Link>
              <Nav.Link as={NavLink} to="/teacher/stato-classe">Stato Classe</Nav.Link>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <Nav.Link as={NavLink} to="/student">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/student/compiti">Compiti Assegnati</Nav.Link>
              <Nav.Link as={NavLink} to="/student/punteggi">Valutazioni</Nav.Link>
            </>
          )}
        </Nav>

        {user && (
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-muted small">👤 {user.name}</span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onLogout()}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
}

export default AppNavbar;


