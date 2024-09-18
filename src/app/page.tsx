import React from 'react';
// import CardList from '@/app/components/CardList';
import CardListSSR from './components/CardListSSR';
// import { getServerSideProps } from './utils/getServerSideProps';

// const Home: React.FC = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Infinite Scroll Card List</h1>
//       <CardList />
//     </div>
//   );
// };



export async function Home(){
  

  // console.log({res})

  try {
    // Adjust URL as needed for your local or production environment
    const res = await fetch(`http://localhost:3000/api/dummyCards?offset=0&limit=10`);
    
    
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await res.json();
    
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Infinite Scroll Card List</h1>
        <CardListSSR initialCards={data.data} initialOffset={0} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
     
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">No Card List</h1>
        
      </div>
    );
  }
  
};

export default Home;




