
import React from 'react';
import { useRoutes } from 'react-router-dom';
import router from './routes';

// Use the router configuration from routes.tsx
function App() {
  // The router is already an array of route objects, not a Router instance
  const routes = useRoutes(router);
  return routes;
}

export default App;
