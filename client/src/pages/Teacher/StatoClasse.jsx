import { useEffect, useState } from 'react';
import API from '../../api/API.mjs';
import { Table, Container, Alert, Form } from 'react-bootstrap';

function StatoClasse() {
  const [studenti, setStudenti] = useState([]);
  const [errore, setErrore] = useState('');
  const [ordinamento, setOrdinamento] = useState('nome');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.getStatoClasse();
        setStudenti(res);
      } catch (err) {
        setErrore('Errore nel caricamento dello stato della classe.');
      }
    };
    fetchStats();
  }, []);

  const studentiOrdinati = [...studenti].sort((a, b) => {
    if (ordinamento === 'nome') return a.name.localeCompare(b.name);
    if (ordinamento === 'totale') return (b.aperti + b.chiusi) - (a.aperti + a.chiusi);
    if (ordinamento === 'media') return b.media - a.media;
    return 0;
  });

  return (
    <Container>
      <h2 className="mb-4">Stato della Classe</h2>

      <Form.Group className="mb-3" controlId="ordinamento">
        <Form.Label>Ordina per:</Form.Label>
        <Form.Select value={ordinamento} onChange={(e) => setOrdinamento(e.target.value)}>
          <option value="nome">Nome</option>
          <option value="totale">Numero totale di compiti</option>
          <option value="media">Media dei punteggi</option>
        </Form.Select>
      </Form.Group>

      {errore && <Alert variant="danger">{errore}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Studente</th>
            <th>Compiti Aperti</th>
            <th>Compiti Chiusi</th>
            <th>Media Punteggi</th>
          </tr>
        </thead>
        <tbody>
          {studentiOrdinati.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.aperti}</td>
              <td>{s.chiusi}</td>
              <td>{s.media?.toFixed(2) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StatoClasse;
