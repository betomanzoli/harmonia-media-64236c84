
import React from 'react';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PreviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <MusicPreviewSystem />
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;
