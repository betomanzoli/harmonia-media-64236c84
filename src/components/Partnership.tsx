
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Partner With Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <Handshake className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Collaborative Approach</h3>
            <p className="text-gray-600 mb-4">Work closely with our team to achieve your music production goals.</p>
            <Button variant="outline" className="mt-auto">Learn More</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <DollarSign className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Transparent Pricing</h3>
            <p className="text-gray-600 mb-4">Clear pricing structure with no hidden fees or surprise costs.</p>
            <Button variant="outline" className="mt-auto">View Packages</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
            <p className="text-gray-600 mb-4">Get personalized attention from our experienced team members.</p>
            <Button variant="outline" className="mt-auto">Contact Us</Button>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button size="lg" className="bg-primary hover:bg-primary/90">Start Your Partnership</Button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
