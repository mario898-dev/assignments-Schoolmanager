import { useState, useEffect } from 'react';
import API from '../../api/API.mjs';
import { Form, Button, Alert, Row, Col, ListGroup, Badge, Container } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';

function NuovoCompito({ user, onLogout }) {
  const [domanda, setDomanda] = useState('');
  const [studenti, setStudenti] = useState([]);
  const [studentiSelezionati, setStudentiSelezionati] = useState([]);
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');


  useEffect(() => {
    const fetchStudenti = async () => {
      try {
        const res = await API.getAllStudents();
        setStudenti(res);
      } catch (err) {
        setErrore('Errore nel caricamento degli studenti.');
      }
    };
    fetchStudenti();
  }, []);

  useEffect(() => {
  if (errore) {
    const timer = setTimeout(() => setErrore(''), 3000);
    return () => clearTimeout(timer);
  }
}, [errore]);


  const toggleSelezione = (id) => {
    setStudentiSelezionati(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore('');

    if (studentiSelezionati.length < 2 || studentiSelezionati.length > 6) {
      setErrore('Un gruppo deve avere da 2 a 6 studenti.');
      return;
    }

    try {
      const { valido } = await API.validaGruppo(studentiSelezionati);
      if (!valido) {
        setErrore('Questo gruppo contiene almeno una coppia che ha già lavorato insieme in ≥2 compiti.');
        return;
      }

      await API.creaCompito({ domanda, studenti: studentiSelezionati });
      setSuccesso('Compito creato con successo!');
      setDomanda('');
      setStudentiSelezionati([]);
    } catch (err) {
      setErrore('Errore nella creazione del compito.');
    }
  };

  return (
  <Container fluid className="p-4">
     
        <PageHeader title="Crea Nuovo Compito" icon="📘" />
      <div className="p-4">
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="domanda">
                <Form.Label>Domanda</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={domanda}
                  onChange={e => setDomanda(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Studenti selezionati</Form.Label>
                <div>
                  {studentiSelezionati.map(id => {
                    const stud = studenti.find(s => s.id === id);
                    return (
                      <Badge bg="secondary" pill className="me-1" key={id}>
                        {stud?.name}
                      </Badge>
                    );
                  })}
                </div>
              </Form.Group>
          
              {errore && <Alert variant="danger">{errore}</Alert>}
              {successo && <Alert variant="success">{successo}</Alert>}

              <Button type="submit">Crea Compito</Button>
            </Form>
          </Col>

          <Col md={6}>
            <h5>Seleziona Studenti</h5>
            <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {studenti.map(s => (
                <ListGroup.Item
                  key={s.id}
                  action
                  style={{
                    backgroundColor: studentiSelezionati.includes(s.id) ? '#f0f0f0' : 'white',
                    fontWeight: studentiSelezionati.includes(s.id) ? '500' : 'normal',
                  }}
                  onClick={() => toggleSelezione(s.id)}
                >
                  {s.name} <small className="text-muted">({s.email})</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
      </Container>
   
  );
}

export default NuovoCompito;
