import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ModalProvider } from './components/ModalContext';
import ErrorBoundary from "./components/errorBoundary";
import "./components/styles/errorBoundary.css";
import { ServerStatusProvider } from "./ServerStatusContext";
import ActivityMonitor from './_utils/ActivityMonitor';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ModalProvider>
        <ServerStatusProvider>
          <BrowserRouter>
            <ActivityMonitor>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ActivityMonitor>
          </BrowserRouter>
        </ServerStatusProvider>
      </ModalProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
reportWebVitals();
