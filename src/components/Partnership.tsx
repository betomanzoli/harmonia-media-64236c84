
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Strategic Partnerships</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Join our network of partners and collaborators to expand your reach and create new opportunities in the music production industry.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Handshake className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
            <p className="text-gray-600 mb-4">
              Partner with us on joint projects, co-productions, and creative initiatives 
              to reach wider audiences and create innovative audio experiences.
            </p>
            <Button variant="outline" className="mt-2">Learn More</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Affiliate Program</h3>
            <p className="text-gray-600 mb-4">
              Join our affiliate program to earn commissions by referring clients 
              to our services. Benefit from our trusted reputation in music production.
            </p>
            <Button variant="outline" className="mt-2">Join Program</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Producer Options</h3>
            <p className="text-gray-600 mb-4">
              For professional producers looking to expand their client base, 
              we offer partnership options to connect you with our network.
            </p>
            <Button variant="outline" className="mt-2">Contact Us</Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button className="px-6">Become a Partner</Button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
