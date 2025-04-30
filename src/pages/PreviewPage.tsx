
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      navigate(`/preview/${projectId}`, { replace: true });
    }
  }, [projectId, navigate]);

  return null; // This component just redirects
};

export default PreviewPage;
