"use client"
import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

type CardData = {
  id: number;
  image: string;
  image2:string,
  title: string;
  description: string;
  info: string;
  buttonText: string;
};

type CardListProps = {
  initialCards: CardData[];
  initialOffset: number;
};

const CardListSSR: React.FC<CardListProps> = ({ initialCards, initialOffset }) => {
    
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreCards = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/dummyCards?offset=${offset}&limit=10`);
      const data = await response.json();

      setCards((prevCards) => [...prevCards, ...data.data]);
      setOffset((prevOffset) => prevOffset + 10);
      setHasMore(data.data.length > 0);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreCards();
        }
      },
      { threshold: 1 }
    );

    if (lastCardRef.current) {
      observer.current.observe(lastCardRef.current);
    }

    return () => {
      if (observer.current && lastCardRef.current) {
        observer.current.unobserve(lastCardRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={index === cards.length - 1 ? lastCardRef : null}
          >
            <Card
              image={card.image}
              image2={card.image2}
              title={card.title}
              description={card.description}
              info={card.info}
              buttonText={card.buttonText}
              onActionClick={() => alert(`Card with ID: ${card.id} clicked!`)}
              lazyLoadImage={index > 1}
            />
          </div>
        ))}
      </div>
      {loading && <div className="text-center py-4">Loading more cards...</div>}
      {!hasMore && <div className="text-center py-4">No more cards to load</div>}
    </div>
  );
};

export default CardListSSR;
