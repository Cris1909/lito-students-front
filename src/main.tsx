import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <LocalizationProvider dateAdapter={AdapterDayjs}>

    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
     </LocalizationProvider>
  </React.StrictMode>,
);
