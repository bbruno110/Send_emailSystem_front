// pages/Home.tsx

import React from 'react';
import Cards from '@/components/Cards';

const Home: React.FC = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full md:w-auto">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Lista de Empresas</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <Cards />
        </div>
      </div>
    </div>
  );
};

export default Home;
