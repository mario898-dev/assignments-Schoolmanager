import { Card, Form, Button } from 'react-bootstrap';

function CompitoCard({ task, risposta, onRispostaChange, onInvio }) {
  const isAperto = task.status === 'open';

  return (
    <Card>
      <Card.Body>
        <Card.Title>Domanda</Card.Title>
        <Card.Text>{task.question}</Card.Text>

        {isAperto ? (
          <>
            <Form.Group className="mb-2">
              <Form.Label>{risposta ? 'Modifica la risposta:' : 'Rispondi:'}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={risposta}
                onChange={e => onRispostaChange(e.target.value)}
              />
            </Form.Group>
            <Button onClick={onInvio}>Invia</Button>
          </>
        ) : (
          <>
            <Form.Label className="text-muted">Risposta (non modificabile)</Form.Label>
            <Form.Control as="textarea" value={task.risposta} readOnly />
            <p className="text-muted mt-2">Compito chiuso</p>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default CompitoCard;
