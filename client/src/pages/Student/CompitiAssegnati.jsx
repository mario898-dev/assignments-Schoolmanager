import { useEffect, useState } from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import RefreshButton from '../../components/common/RefreshButton';
import PageHeader from '../../components/common/PageHeader';
import CustomContainer from '../../components/common/CustomContainer';
import CompitoCard from '../../components/Student/CompitoCard';
import API from '../../api/API.mjs';

function CompitiAssegnati({ user }) {
  const [compiti, setCompiti] = useState([]);
  const [risposte, setRisposte] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCompiti = async () => {
    try {
      const dati = await API.getCompitiAssegnati();
      setCompiti(dati);

      //Per aggiornare il box risposta quando altri studenti rispondono
      const nuoveRisposte = {};
      dati.forEach(c => {
        if (c.risposta) {
          nuoveRisposte[c.taskID] = c.risposta;
        }
      });
      setRisposte(nuoveRisposte);
    } catch {
      setError('Errore nel caricamento dei compiti.');
    }
  };

  useEffect(() => {
    if (user?.role === 'student') fetchCompiti();
  }, [user]);

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
    <CustomContainer>
      <PageHeader title="Compiti Assegnati" icon="✍️" />
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <RefreshButton onClick={fetchCompiti} label="Aggiorna Compiti" />
      </div>

      {compiti.filter(c => c.status === 'open').length === 0 && (
        <Alert variant="info">Nessun compito attivo presente.</Alert>
      )}

      <Row xs={1} md={2}>
        {compiti.map(task => (
          <Col key={task.taskID} className="mb-4">
            <CompitoCard
              task={task}
              risposta={risposte[task.taskID] ?? task.risposta ?? ''}
              onRispostaChange={val =>
                setRisposte({ ...risposte, [task.taskID]: val })
              }
              onInvio={() => handleInvio(task.taskID)}
            />
          </Col>
        ))}
      </Row>
    </CustomContainer>
  );
}

export default CompitiAssegnati;
