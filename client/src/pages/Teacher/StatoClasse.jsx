import { useEffect, useState } from 'react';
import API from '../../api/API.mjs';
import { Alert, Form, Row, Col, Badge, Card } from 'react-bootstrap';
import CustomContainer from '../../components/common/CustomContainer';
import RefreshButton from '../../components/common/RefreshButton';
import PageHeader from '../../components/common/PageHeader';

function StatoClasse() {
  const [studenti, setStudenti] = useState([]);
  const [errore, setErrore] = useState('');
  const [ordinamento, setOrdinamento] = useState('nome');

  const fetchStats = async () => {
    try {
      const res = await API.getStatoClasse();
      setStudenti(res);
      setErrore('');
    } catch (err) {
      setErrore('Errore nel caricamento dello stato della classe.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const studentiOrdinati = [...studenti].sort((a, b) => {
    if (ordinamento === 'nome') return a.name.localeCompare(b.name);
    if (ordinamento === 'totale') return (b.aperti + b.chiusi) - (a.aperti + a.chiusi);
    if (ordinamento === 'media') return b.media - a.media;
    return 0;
  });

  return (
    <CustomContainer>
      <PageHeader title="Stato della Classe" icon="📊" />

      <div className="d-flex justify-content-end mb-3">
        <RefreshButton onClick={fetchStats} label="Aggiorna Stato" />
      </div>

      <Form.Group className="mb-4" controlId="ordinamento">
        <Form.Label>Ordina per:</Form.Label>
        <Form.Select value={ordinamento} onChange={(e) => setOrdinamento(e.target.value)}>
          <option value="nome">Nome</option>
          <option value="totale">Numero totale di compiti</option>
          <option value="media">Media dei punteggi</option>
        </Form.Select>
      </Form.Group>

      {errore && <Alert variant="danger">{errore}</Alert>}

      {/* Intestazione */}
      <Row className="fw-bold py-2 border-bottom text-muted">
        <Col xs={12} md={4}>Studente</Col>
        <Col xs={6} md={2}>Aperti</Col>
        <Col xs={6} md={2}>Chiusi</Col>
        <Col xs={6} md={2}>Totale</Col>
        <Col xs={6} md={2}>Media</Col>
      </Row>

      {studentiOrdinati.map((s) => (
        <Row key={s.id} className="py-3 border-bottom align-items-center">
          <Col xs={12} md={4} className="fw-semibold">{s.name}</Col>
          <Col xs={6} md={2}><Badge bg="warning">{s.aperti}</Badge></Col>
          <Col xs={6} md={2}><Badge bg="success">{s.chiusi}</Badge></Col>
          <Col xs={6} md={2}><Badge bg="secondary">{s.aperti + s.chiusi}</Badge></Col>
          <Col xs={6} md={2}>
            {s.media !== null ? (
              <Badge bg="primary">{s.media.toFixed(2)}</Badge>
            ) : (
              <Badge bg="secondary">—</Badge>
            )}
          </Col>
        </Row>
      ))}
    </CustomContainer>
  );
}

export default StatoClasse;

