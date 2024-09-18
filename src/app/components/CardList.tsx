"use client";
import React, { useState, useEffect } from "react";
import Card from "./Card";
import useInfiniteScroll from "@/app/hooks/useInfiniteScroll";

type CardData = {
  id: number;
  image: string;
  image2:string,
  title: string;
  description: string;
  info: string;
  buttonText: string;
};

type ApiResponse = {
  offset: number;
  limit: number;
  total: number;
  data: CardData[];
};

const CardList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);

  const triggerElement = useInfiniteScroll(() => {
    if (hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  });

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    const fetchCards = async () => {
      if (offset <= 50) {
        try {
          const response = await fetch(
            `/api/dummyCards?offset=${offset}&limit=${limit}`
          );
          const data: ApiResponse = await response.json();
          setCards((prevCards) => [...prevCards, ...data.data]);
          setHasMore(offset + limit < data.total);
        } catch (error) {
          console.error("Error fetching cards:", error);
        }
      }
    };

    if(mounted){
        fetchCards();
    }
    
  }, [offset, limit, mounted]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={card.id+`card`}
            image={card.image}
            image2={card.image2}
            title={card.title}
            description={card.description}
            info={card.info}
            buttonText={card.buttonText}
            lazyLoadImage={index > 1}
            // onActionClick={() => alert(`Card with ID: ${card.id} clicked!`)}
          />
        ))}
      </div>
      <div ref={triggerElement} className="h-100"></div>
    </div>
  );
};

export default CardList;
