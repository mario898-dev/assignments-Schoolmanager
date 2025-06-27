import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function Login({ onLogin, message, clearMessage }) {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <>
      <h2 className="mb-4 text-center">Login</h2>

      {message && (
        <Alert variant="danger" dismissible onClose={() => clearMessage('')}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Control
          className="mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Form.Control
          className="mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </>
  );
}

export default Login;
