import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Join from './pages/Join.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
    </Routes>
  );
}

export default App;
