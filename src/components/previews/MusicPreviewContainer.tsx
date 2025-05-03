
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MusicPreviewContainerProps {
  children: ReactNode;
}

const MusicPreviewContainer: React.FC<MusicPreviewContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreviewContainer;
