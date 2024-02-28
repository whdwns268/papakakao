import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import Main from './Main'; // 메인 페이지 컴포넌트 import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<App />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
