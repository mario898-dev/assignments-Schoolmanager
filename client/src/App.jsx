import { BrowserRouter } from 'react-router-dom';
import SchoolManager from './components/SchoolManager';

export default function App() {
  return (
    <BrowserRouter>
      <SchoolManager />
    </BrowserRouter>
  );
}
