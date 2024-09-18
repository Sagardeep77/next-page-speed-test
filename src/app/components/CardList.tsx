"use client";
import React, { useState, useEffect } from "react";
import Card from "./Card";
import useInfiniteScroll from "@/app/hooks/useInfiniteScroll";

type CardData = {
  id: number;
  image: string;
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

  const triggerElement = useInfiniteScroll(() => {
    if (hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  });

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

    fetchCards();
  }, [offset, limit]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            title={card.title}
            description={card.description}
            info={card.info}
            buttonText={card.buttonText}
            // onActionClick={() => alert(`Card with ID: ${card.id} clicked!`)}
          />
        ))}
      </div>
      <div ref={triggerElement} className="h-100"></div>
    </div>
  );
};

export default CardList;
