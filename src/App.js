import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BingoGame from './BingoApp';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/bingo" element={<BingoGame />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;