
import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import router from './routes';

// Use the router configuration from routes.tsx
function App() {
  const routes = useRoutes(router);
  return routes;
}

export default App;
