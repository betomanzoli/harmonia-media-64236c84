
import React from 'react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            {/* Simple text logo */}
            <h3 className="text-2xl font-bold text-green-400 mb-4">harmonIA</h3>
            <p className="text-gray-300 mb-6">
              Criamos músicas personalizadas usando inteligência artificial com supervisão humana.
            </p>
          </div>
          {/* ... resto do footer */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
