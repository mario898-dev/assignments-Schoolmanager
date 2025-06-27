import { Container, Row, Col, Card } from 'react-bootstrap';

function StudentHome({ user }) {
  return (
    <Container className="px-4">
      <h2 className="mb-4">Bentornato, {user.name}!</h2>
      <Row>
        {/* Colonna sinistra - Profilo */}
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <div style={{ fontSize: '4rem' }}>🎓</div>  {/* Coroncina estetica*/}
              <h5 className="mt-3">{user.name}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <small>ID: {user.id}</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Colonna destra - Statistiche */}
        <Col md={8}>
          <Row className="g-3">
            <Col md={6}>
              <Card>
                <Card.Body className="text-center">
                  <h6>Compiti Assegnati</h6>
                  <h3>5</h3> {/* Placeholder */}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Body className="text-center">
                  <h6>Compiti Conseganti</h6>
                  <h3>3</h3> {/* Placeholder */}
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <Card>
                <Card.Body className="text-center">
                  <h6>Media Voti (Compiti Chiusi)</h6>
                  <h3>27.3</h3> {/* Placeholder */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentHome;
