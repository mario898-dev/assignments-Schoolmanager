import { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import API from '../../api/API.mjs';

function CompitiAssegnati({ user, onLogout }) {
  const [compiti, setCompiti] = useState([]);
  const [risposte, setRisposte] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') return;

    const fetchCompiti = async () => {
      try {
        const dati = await API.getCompitiAssegnati();
        setCompiti(dati);
      } catch (err) {
        setError('Errore nel caricamento dei compiti.');
      }
    };
    fetchCompiti();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleInvio = async (taskID) => {
    const risposta = risposte[taskID];
    try {
      await API.inviaRisposta(taskID, risposta);
      setSuccess('Risposta inviata!');
      setError('');
      setCompiti(compiti.map(c =>
        c.taskID === taskID ? { ...c, risposta } : c
      ));
    } catch {
      setSuccess('');
      setError('Errore durante l’invio della risposta.');
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Compiti Assegnati</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row xs={1} md={2}>
        {compiti.map(task => (
          <Col key={task.taskID} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Domanda</Card.Title>
                <Card.Text>{task.question}</Card.Text>

                {task.status === 'open' ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>{task.risposta ? 'Modifica la risposta:' : 'Rispondi:'}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={risposte[task.taskID] ?? task.risposta ?? ''}
                        onChange={e =>
                          setRisposte({ ...risposte, [task.taskID]: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Button onClick={() => handleInvio(task.taskID)}>Invia</Button>
                  </>
                ) : (
                  <>
                    <Card.Subtitle className="mb-2 text-muted">Risposta (non modificabile)</Card.Subtitle>
                    <Form.Control as="textarea" value={task.risposta} readOnly />
                    <p className="text-muted mt-2">Compito chiuso</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CompitiAssegnati;
