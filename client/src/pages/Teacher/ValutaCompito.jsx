import { useEffect, useState } from 'react';
import { Form, Button, Alert, Row, Col, Card, Container } from 'react-bootstrap';
import RefreshButton from '../../components/RefreshButton';
import PageHeader from '../../components/PageHeader';
import API from '../../api/API.mjs';

function ValutaCompito() {
  const [compiti, setCompiti] = useState([]);
  const [valutazioni, setValutazioni] = useState({});
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');

  const fetchCompiti = async () => {
    try {
      const dati = await API.getCompitiCreati();
      setCompiti(dati);
      setErrore('');
    } catch (err) {
      setErrore('Errore nel caricamento dei compiti.');
    }
  };

  useEffect(() => {
    fetchCompiti();
  }, []);

  useEffect(() => {
  if (errore) {
    const timer = setTimeout(() => setErrore(''), 3000);
    return () => clearTimeout(timer);
  }
}, [errore]);

useEffect(() => {
  if (successo) {
    const timer = setTimeout(() => setSuccesso(''), 3000);
    return () => clearTimeout(timer);
  }
}, [successo]);


  const handleValuta = async (taskID) => {
    const score = valutazioni[taskID];
    if (isNaN(score) || score < 0 || score > 30) {
      setErrore('Inserisci un punteggio valido (0–30).');
      return;
    }

    try {
      await API.inviaValutazione(taskID, parseInt(score));
      setSuccesso(`Compito valutato con successo.`);
      setErrore('');
      setCompiti(prev =>
        prev.map(c =>
          c.taskID === taskID ? { ...c, status: 'closed', score: parseInt(score) } : c
        )
      );
    } catch (err) {
      setSuccesso('');
      setErrore(err.message || 'Errore durante la valutazione.');
    }
  };

  return (
    <Container fluid className="p-4">
      <PageHeader title="Valuta Compito" icon="✍️" />

      {errore && <Alert variant="danger">{errore}</Alert>}
      {successo && <Alert variant="success">{successo}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <RefreshButton onClick={fetchCompiti} label="Aggiorna Compiti" />
      </div>

      <Row xs={1} md={2}>
        {compiti.map(task => (
          <Col key={task.taskID} className="mb-4">
            <Card className={`shadow-sm ${task.status === 'closed' ? 'bg-light' : 'bg-warning-subtle'}`}>
              <Card.Body>
                <Card.Title>Domanda</Card.Title>
                <Card.Text>{task.question}</Card.Text>

                {task.risposta ? (
                  <>
                    <hr />
                    <Card.Subtitle className="mb-2 text-muted">Risposta del gruppo</Card.Subtitle>
                    <Form.Control as="textarea" value={task.risposta} readOnly rows={4} />
                  </>
                ) : (
                  <p className="text-muted">Nessuna risposta inviata.</p>
                )}

                {task.status === 'open' && task.risposta ? (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label>Inserisci valutazione (0–30)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="30"
                        value={valutazioni[task.taskID] ?? ''}
                        onChange={e =>
                          setValutazioni({ ...valutazioni, [task.taskID]: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Button className="mt-2" onClick={() => handleValuta(task.taskID)}>
                      Valuta
                    </Button>
                  </>
                ) : task.status === 'closed' ? (
                  <p className="mt-3 fw-bold text-success">Valutato: {task.score}/30</p>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ValutaCompito;
