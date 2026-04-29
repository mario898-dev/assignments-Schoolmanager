import { Form, Button, Alert, Badge } from 'react-bootstrap';

function CompitoForm({
  domanda,
  onDomandaChange,
  studenti,
  studentiSelezionati,
  onSubmit,
  errore,
  successo
}) {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="domanda">
        <Form.Label>Domanda</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={domanda}
          onChange={e => onDomandaChange(e.target.value)}
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
  );
}

export default CompitoForm;
