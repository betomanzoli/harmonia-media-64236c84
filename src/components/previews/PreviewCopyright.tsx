
import React from 'react';
import { Card } from "@/components/ui/card";

const PreviewCopyright: React.FC = () => {
  return (
    <Card className="p-6 text-sm text-gray-500">
      <p className="text-center">
        Estas prévias são protegidas por direitos autorais e destinadas apenas para sua avaliação pessoal. 
        © harmonIA {new Date().getFullYear()}
      </p>
    </Card>
  );
};

export default PreviewCopyright;
