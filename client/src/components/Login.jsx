import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem' }}>🔒</div>
          <h3 className="fw-bold mt-2">Accesso alla piattaforma</h3>
          <p className="text-muted small">Inserisci le tue credenziali per continuare</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="nome@exam.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 fw-semibold" variant="primary">
            Accedi
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;


