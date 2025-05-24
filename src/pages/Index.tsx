import React from 'react';
import { Navigate } from 'react-router-dom';

// ✅ COMPONENTE PARA REDIRECIONAR PARA HOME
const Index: React.FC = () => {
  return <Navigate to="/" replace />;
};

export default Index;
