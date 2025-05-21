import React from 'react';
import { Truck, Wallet, Headphones } from 'lucide-react';

const services = [
  {
    icon: <Truck className="w-12 h-12 text-[#F2631F]" />,
    title: 'Free Shipping',
    description: 'For invoices over $1,500'
  },
  {
    icon: <Wallet className="w-12 h-12 text-[#F2631F]" />,
    title: 'Cash Back',
    description: 'When paying for products via Dasun Wallet'
  },
  {
    icon: <Headphones className="w-12 h-12 text-[#F2631F]" />,
    title: '24/7 Support',
    description: 'When something goes wrong'
  }
];

const Services: React.FC = () => {
  return (
    <section className="pb-12">
      <div className="container mx-auto px-4 xl:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center px-0 py-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                {service.title}
              </h3>
              <p className="text-gray-700">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
