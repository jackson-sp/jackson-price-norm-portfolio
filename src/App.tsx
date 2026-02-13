import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import BattlecardGenerator from './pages/BattlecardGenerator';
import MessagingPlaybookGenerator from './pages/MessagingPlaybookGenerator';
import PersonaCardGenerator from './pages/PersonaCardGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/battlecard" element={<BattlecardGenerator />} />
        <Route path="/playbook" element={<MessagingPlaybookGenerator />} />
        <Route path="/persona" element={<PersonaCardGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
