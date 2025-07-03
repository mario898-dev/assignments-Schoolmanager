import { Row, Col, Card, Container, Badge } from 'react-bootstrap';

function TeacherHome({ user }) {
  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">👩‍🏫 Benvenut*, <strong>{user.name}</strong>!</h2>

      <Row>
        {/* Colonna sinistra - Profilo docente */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center bg-light rounded">
              <div style={{ fontSize: '4rem' }}>👨‍🏫</div>
              <h5 className="mt-3">{user.name}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <Badge bg="dark">Ruolo: Docente</Badge>
            </Card.Body>
          </Card>
        </Col>

        {/* Colonna destra - Guida alle funzionalità */}
        <Col md={8}>
          <Card className="shadow-sm border-start border-info border-4">
            <Card.Body>
              <h5 className="mb-3">📌 Cosa puoi fare come docente</h5>
              <ul className="mb-0">
                <li>✏️ Creare nuovi compiti selezionando gruppi di studenti</li>
                <li>📬 Visualizzare le risposte ai compiti assegnati</li>
                <li>📊 Valutare i compiti con un punteggio da 0 a 30</li>
                <li>📈 Monitorare lo stato generale della classe</li>
              </ul>
            </Card.Body>
          </Card>

      <Card className="mt-4 shadow-sm border-start border-warning border-4">
        <Card.Body>
          <h5 className="mb-3 text-warning">⚠️ Attenzione alle regole nella creazione dei compiti</h5>
          <ul className="mb-0">
            <li>
              Non puoi creare un gruppo in cui <strong>una qualunque coppia di studenti</strong> abbia già lavorato insieme in <strong>almeno 2 compiti precedenti</strong> creati da te.
            </li>
            <li>
              I gruppi devono contenere tra <strong>2 e 6 studenti</strong>.
            </li>
            <li>
              Dopo la creazione, il compito sarà <strong>automaticamente aperto</strong> e modificabile dagli studenti.
            </li>
          </ul>
        </Card.Body>
      </Card>

        </Col>
      </Row>
    </Container>
  );
}

export default TeacherHome;
