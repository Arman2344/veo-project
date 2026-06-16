import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { I18nProvider } from './i18n/I18nContext';
import './styles/global.css';

// We use HashRouter (URLs like /#/products) instead of BrowserRouter because
// GitHub Pages serves static files with no server-side rewrites — a direct
// visit/refresh on a path like /products would 404 with BrowserRouter.
// HashRouter keeps all routing client-side and works reliably on GH Pages.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </I18nProvider>
  </StrictMode>,
);
