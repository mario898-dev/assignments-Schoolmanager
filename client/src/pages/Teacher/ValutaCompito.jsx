import { useEffect, useState } from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import RefreshButton from '../../components/common/RefreshButton';
import PageHeader from '../../components/common/PageHeader';
import CustomContainer from '../../components/common/CustomContainer';
import CompitoDaValutare from '../../components/Teacher/CompitoDaValutare';
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
    } catch {
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
      setSuccesso('Compito valutato con successo.');
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
    <CustomContainer>
      <PageHeader title="Valuta Compito" icon="✍️" />
      {errore && <Alert variant="danger">{errore}</Alert>}
      {successo && <Alert variant="success">{successo}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <RefreshButton onClick={fetchCompiti} label="Aggiorna Compiti" />
      </div>

      <Row xs={1} md={2}>
        {compiti.map(task => (
          <Col key={task.taskID} className="mb-4">
            <CompitoDaValutare
              task={task}
              valutazione={valutazioni[task.taskID]}
              onChangeValutazione={(id, val) =>
                setValutazioni({ ...valutazioni, [id]: val })
              }
              onValuta={handleValuta}
            />
          </Col>
        ))}
      </Row>
    </CustomContainer>
  );
}

export default ValutaCompito;
