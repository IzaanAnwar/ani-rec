import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AnimeRecommendations from './components/AnimeRecommendations.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className="text-center ">Something Went Wrong Try Again</div>,
  },
  {
    path: '/recommendations',
    element: <AnimeRecommendations />,
    errorElement: <div className="text-center ">Something Went Wrong Try Again</div>,
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
