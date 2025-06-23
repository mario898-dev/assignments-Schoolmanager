import { useState } from 'react';
import { Alert, Button, Form, Container } from 'react-bootstrap';

export default function Login({ onLogin, message, clearMessage }){
  const [email,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    clearMessage();
    if(!email || !password){
      clearMessage('Inserisci username e password');
      return;
    }
    onLogin(email, password);
  };

  return (
    <Container style={{ maxWidth:400, marginTop:'3rem' }}>
      <h2>Login</h2>
      {message && <Alert variant="danger" dismissible onClose={() => clearMessage('')}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Control className="mb-3" placeholder="email" value={email}
                      onChange={e=>setUsername(e.target.value)} />
        <Form.Control className="mb-3" type="password" placeholder="Password"
                      value={password} onChange={e=>setPassword(e.target.value)} />
        <Button variant="primary" type="submit" className="w-100">Login</Button>
      </Form>
    </Container>
  );
}

