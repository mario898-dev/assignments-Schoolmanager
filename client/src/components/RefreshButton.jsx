import { Button } from 'react-bootstrap';

function RefreshButton({ onClick, label = "Aggiorna", className = "" }) {
  return (
    <Button variant="outline-primary" onClick={onClick} className={`mb-3 ${className}`}>
      🔄 {label}
    </Button>
  );
}

export default RefreshButton;
