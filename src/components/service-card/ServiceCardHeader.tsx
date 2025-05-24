
import React from 'react';
import PopularBadge from './PopularBadge';

interface ServiceCardHeaderProps {
  title: string;
  price: string;
  description: string;
  recommended?: boolean;
}

const ServiceCardHeader: React.FC<ServiceCardHeaderProps> = ({
  title,
  price,
  description,
  recommended = false
}) => {
  return (
    <>
      {recommended && <PopularBadge />}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold">{price}</span>
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
    </>
  );
};

export default ServiceCardHeader;
