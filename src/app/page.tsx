'use client'
import React from 'react';
import Cards from '@/components/Cards';

const Home: React.FC = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-start py-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full md:w-auto flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center select-none">Lista de Empresas</h1>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full">
            <Cards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
