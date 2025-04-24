import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Connect } from '@stacks/connect-react';
import App from './App.jsx';
import { ThemeProvider } from './components/ThemeProvider.js';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Connect
        authOptions={{
          appDetails: {
            name: "Stacks Token Factory",
            icon: window.location.origin + "/logo.png",
          },
          redirectTo: "/",
          onFinish: () => {
            window.location.reload();
          },
        }}
      >
        <App />
      </Connect>
    </ThemeProvider>
  </React.StrictMode>
);
