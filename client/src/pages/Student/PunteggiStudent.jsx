import { useEffect, useState } from 'react';
import { Row, Col, Badge, Alert } from 'react-bootstrap';
import RefreshButton from '../../components/common/RefreshButton';
import PageHeader from '../../components/common/PageHeader';
import CustomContainer from '../../components/common/CustomContainer';
import API from '../../api/API.mjs';

function PunteggiStudent() {
  const [compiti, setCompiti] = useState([]);
  const [media, setMedia] = useState(null);
  const [errore, setErrore] = useState('');

  const fetchPunteggi = async () => {
    try {
      const { compiti, media } = await API.getPunteggiStudent();
      setCompiti(compiti);
      setMedia(media);
      setErrore('');
    } catch (err) {
      setErrore('Errore nel caricamento dei punteggi.');
    }
  };

  useEffect(() => {
    fetchPunteggi();
  }, []);

  return (
    <CustomContainer>
      <PageHeader title="Valutazioni" icon="📈" />

      {errore && <Alert variant="danger">{errore}</Alert>}

      <div className="d-flex justify-content-end">
        <RefreshButton onClick={fetchPunteggi} label="Aggiorna Punteggi" />
      </div>

      {/* Intestazione */}
      <Row className="fw-bold border-bottom py-2">
        <Col xs={1}>#</Col>
        <Col xs={7}>Domanda</Col>
        <Col xs={4}>Punteggio</Col>
      </Row>

      {/* Lista compiti */}
      {compiti.map((compito, index) => (
        <Row key={compito.taskID} className="align-items-center py-2 border-bottom">
          <Col xs={1}>{index + 1}</Col>
          <Col xs={7}>{compito.question}</Col>
          <Col xs={4}>
            <Badge bg="success">{compito.score}</Badge>
          </Col>
        </Row>
      ))}

      {/* Riga media finale */}
      <Row className="fw-bold pt-3">
        <Col xs={8} className="text-end">Media ponderata:</Col>
        <Col xs={4}>
          {media !== null ? (
            <Badge bg="primary">{media.toFixed(2)}</Badge>
          ) : (
            <Badge bg="secondary">N/D</Badge>
          )}
        </Col>
      </Row>
    </CustomContainer>
  );
}

export default PunteggiStudent;
