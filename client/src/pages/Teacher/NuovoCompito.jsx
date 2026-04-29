import { useState, useEffect } from 'react';
import API from '../../api/API.mjs';
import { Row, Col } from 'react-bootstrap';
import PageHeader from '../../components/common/PageHeader';
import CustomContainer from '../../components/common/CustomContainer';
import CompitoForm from '../../components/Teacher/CompitoForm';
import SelezionaStudenti from '../../components/Teacher/SelezionaStudenti';

function NuovoCompito() {
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
      } catch {
        setErrore('Errore nel caricamento degli studenti.');
      }
    };
    fetchStudenti();
  }, []);

  useEffect(() => {
  if (errore || successo) {
    const timer = setTimeout(() => {
      setErrore('');
      setSuccesso('');
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [errore, successo]);

  const toggleSelezione = (id) => {
    setStudentiSelezionati(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //Per impedire il refresh automatico
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
    } catch {
      setErrore('Errore nella creazione del compito.');
    }
  };

  return (
    <CustomContainer>
      <PageHeader title="Crea Nuovo Compito" icon="📘" />
      <div className="p-4">
        <Row>
          <Col md={6}>
            <CompitoForm
              domanda={domanda}
              onDomandaChange={setDomanda}
              studenti={studenti}
              studentiSelezionati={studentiSelezionati}
              onSubmit={handleSubmit}
              errore={errore}
              successo={successo}
            />
          </Col>
          <Col md={6}>
            <h5>Seleziona Studenti</h5>
            <SelezionaStudenti
              studenti={studenti}
              studentiSelezionati={studentiSelezionati}
              onToggle={toggleSelezione}
            />
          </Col>
        </Row>
      </div>
    </CustomContainer>
  );
}

export default NuovoCompito;
