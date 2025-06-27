import { useEffect, useState } from 'react';
import { Container, Table, Alert, Badge } from 'react-bootstrap';
import API from '../../api/API.mjs';

function PunteggiStudent() {
  const [compiti, setCompiti] = useState([]);
  const [media, setMedia] = useState(null);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    const fetchPunteggi = async () => {
      try {
        const { compiti, media } = await API.getPunteggiStudent();
        setCompiti(compiti);
        setMedia(media);
      } catch (err) {
        setErrore('Errore nel caricamento dei punteggi.');
      }
    };

    fetchPunteggi();
  }, []);

  return (
    <Container>
      <h2 className="mb-4">Valutazioni Ricevute</h2>
      {errore && <Alert variant="danger">{errore}</Alert>}

      {compiti.length > 0 ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Domanda</th>
                <th>Punteggio</th>
              </tr>
            </thead>
            <tbody>
              {compiti.map((c, idx) => (
                <tr key={c.taskID}>
                  <td>{idx + 1}</td>
                  <td>{c.question}</td>
                  <td>
                    <Badge bg="success">{c.score}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="mt-4">Media dei punteggi: <Badge bg="info">{media?.toFixed(2)}</Badge></h5>
        </>
      ) : (
        <p>Nessuna valutazione disponibile.</p>
      )}
    </Container>
  );
}

export default PunteggiStudent;
