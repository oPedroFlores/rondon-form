import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Products from './pages/Products';
import Planilha from './pages/Planilha';
import Error404 from './pages/Error404';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      
      {
        path: 'produtos',
        element: <Products />,
      },
      {
        path: '/',
        element: <Planilha />,
      },
      {
        path: '/planilha',
        element: <Planilha />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
      
    ],
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);