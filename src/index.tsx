import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import cors from './cors';

if (process.env.NODE_ENV === 'production') {
  cors();
}

ReactDOM.render(<App />, document.getElementById('root'));
