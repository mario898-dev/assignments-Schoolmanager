import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../components/Login';

export default function HomePage({ user, onLogin, message, clearMessage }) {
  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      
      {/* --------- LOGIN FORM se non autenticato --------- */}
      {!user && (
        <div className="mb-5 border rounded p-4 bg-white shadow-sm">
          <h3 className="mb-4 text-center">Accedi per continuare</h3>
          <Login onLogin={onLogin} message={message} clearMessage={clearMessage} />
        </div>
      )}

      {/* --------- BLOCCO INFORMATIVO (sempre visibile) --------- */}
      <div className="border rounded p-4 bg-light">
        <h5>SchoolManager tool</h5>
        <p className="text-muted">
          SchoolManager permette di gestire compiti, risposte e valutazioni a seconda del tuo ruolo. 
          Dopo il login verrai indirizzato automaticamente alla tua area personale.
        </p>
      </div>
    </Container>
  );
}

