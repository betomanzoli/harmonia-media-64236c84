
import React, { useState } from 'react';
import ServiceTabs from '@/components/ServiceTabs';
import ServiceExtras from '@/components/ServiceExtras';
import ServiceNotices from '@/components/ServiceNotices';

const ServicesList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    <div>
      <ServiceTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="mt-16">
        <ServiceExtras />
      </div>
      
      <div className="mt-16">
        <ServiceNotices />
      </div>
    </div>
  );
};

export default ServicesList;
