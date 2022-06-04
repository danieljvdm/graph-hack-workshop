import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './index.css';
import Apollo from './Apollo';

import App from './App';
import Home from './scenes/Home';
import Wallets from './scenes/Wallets';
import Collections from './scenes/Collections';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Apollo>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/collections" element={<Collections />} />
          </Route>
        </Routes>
      </Router>
    </Apollo>
  </React.StrictMode>
);
