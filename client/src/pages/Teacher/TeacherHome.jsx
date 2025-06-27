import { Row, Col, Card } from 'react-bootstrap';

function TeacherHome({ user }) {
  return (
    <div className="p-4">
      <Row>
        {/* Profilo docente */}
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <div style={{ fontSize: '4rem' }}>👩‍🏫</div> {/* Emoji profilo docente */}
              <Card.Title className="mt-3">{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
              <Card.Text>Ruolo: <strong>Docente</strong></Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Statistiche */}
        <Col md={8}>
          <h4 className="mb-4">Riepilogo attività</h4>
          <Row className="g-3">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>📋 Compiti Assegnati</Card.Title>
                  <Card.Text className="fs-3">42</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>👨‍🎓 Studenti Coinvolti</Card.Title>
                  <Card.Text className="fs-3">18</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>🔓 Compiti Aperti</Card.Title>
                  <Card.Text className="fs-3">10</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>✅ Compiti Chiusi</Card.Title>
                  <Card.Text className="fs-3">32</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default TeacherHome;

