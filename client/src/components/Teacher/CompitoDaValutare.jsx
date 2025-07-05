import { Card, Form, Button } from 'react-bootstrap';

function CompitoDaValutare({ task, valutazione, onChangeValutazione, onValuta }) {
  const isChiuso = task.status === 'closed';
  const isRispondibile = task.status === 'open' && task.risposta;

  return (
    <Card className={`shadow-sm ${isChiuso ? 'bg-light' : 'bg-warning-subtle'}`}>
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

        {isRispondibile && (
          <>
            <Form.Group className="mt-3">
              <Form.Label>Inserisci valutazione (0–30)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="30"
                value={valutazione ?? ''}
                onChange={e => onChangeValutazione(task.taskID, e.target.value)}
              />
            </Form.Group>
            <Button className="mt-2" onClick={() => onValuta(task.taskID)}>
              Valuta
            </Button>
          </>
        )}

        {isChiuso && (
          <p className="mt-3 fw-bold text-success">Valutato: {task.score}/30</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default CompitoDaValutare;
