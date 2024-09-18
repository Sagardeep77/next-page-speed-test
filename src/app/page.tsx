import React from 'react';
import CardList from '@/app/components/CardList';

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Infinite Scroll Card List</h1>
      <CardList />
    </div>
  );
};

export default Home;
