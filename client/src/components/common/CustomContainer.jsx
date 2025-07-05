import { Container } from 'react-bootstrap';

function CustomContainer({ children }) {
  return <Container fluid className="p-4">{children}</Container>;
}

export default CustomContainer;
