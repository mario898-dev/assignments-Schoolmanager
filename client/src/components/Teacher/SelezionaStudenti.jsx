import { ListGroup } from 'react-bootstrap';

function SelezionaStudenti({ studenti, studentiSelezionati, onToggle }) {
  return (
    <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {studenti.map(s => (
        <ListGroup.Item
          key={s.id}
          action
          style={{
            backgroundColor: studentiSelezionati.includes(s.id) ? '#f0f0f0' : 'white',
            fontWeight: studentiSelezionati.includes(s.id) ? '500' : 'normal',
          }}
          onClick={() => onToggle(s.id)}
        >
          {s.name} <small className="text-muted">({s.email})</small>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default SelezionaStudenti;
