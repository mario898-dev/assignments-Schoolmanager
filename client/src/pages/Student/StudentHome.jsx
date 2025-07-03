import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

function StudentHome({ user }) {
  return (
    <Container fluid className="px-4 py-4">
      <h2 className="mb-4">🎉 Bentornat*, <strong>{user.name}</strong>!</h2>

      <Row>
        {/* Colonna sinistra - Profilo utente */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center bg-light rounded">
              <div style={{ fontSize: '4rem' }}>🎓</div>
              <h5 className="mt-3">{user.name}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <Badge bg="secondary">ID: {user.id}</Badge>
            </Card.Body>
          </Card>
        </Col>

        {/* Colonna destra - Cosa può fare e Regole */}
        <Col md={8}>
          {/* Box funzionalità */}
          <Card className="shadow-sm border-start border-info border-4 mb-4">
            <Card.Body>
              <h5 className="mb-3">📌 Cosa puoi fare in questa piattaforma</h5>
              <ul className="mb-0">
                <li>📝 Visualizzare i compiti aperti che ti sono stati assegnati</li>
                <li>📤 Inviare o modificare la risposta ai compiti (fino alla valutazione)</li>
                <li>📈 Controllare i punteggi ricevuti per i compiti già valutati</li>
                <li>📊 Visualizzare la tua media ponderata</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Box regole */}
          <Card className="shadow-sm border-start border-warning border-4">
            <Card.Body>
              <h5 className="mb-3 text-warning">⚠️ Regole da ricordare</h5>
              <ul className="mb-0">
                <li>👥 Puoi vedere i compiti aperti a cui partecipi.</li>
                <li>✍️ Tu o qualsiasi membro del gruppo potete inviare o modificare la risposta.</li>
                <li>🔒 Una volta che il docente valuta il compito, non potrai più modificarlo.</li>
                <li>📊 Potrai consultare i tuoi punteggi nei compiti chiusi e la tua media ponderata.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentHome;

