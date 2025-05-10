
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Contact from '@/components/Contact';

const ContactPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="pt-24">
        <Contact />
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
