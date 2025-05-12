
import React from 'react';
import { DiagnosticInfo } from '../DiagnosticsPanel';

interface BasicDiagnosticInfoProps {
  diagnosticInfo: DiagnosticInfo;
}

const BasicDiagnosticInfo: React.FC<BasicDiagnosticInfoProps> = ({ diagnosticInfo }) => {
  return (
    <>
      <p>Navegador: {diagnosticInfo.browserName} {diagnosticInfo.browserVersion}</p>
      <p>Sistema: {diagnosticInfo.operatingSystem}</p>
      <p>Storage: {diagnosticInfo.localStorageAvailable ? 'Disponível' : 'Indisponível'}</p>
    </>
  );
};

export default BasicDiagnosticInfo;
