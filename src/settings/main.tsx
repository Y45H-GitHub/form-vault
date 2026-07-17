import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Settings } from './Settings';
import { ToastProvider } from '../shared/ui/ToastProvider';
import '../shared/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <Settings />
    </ToastProvider>
  </StrictMode>
);
