import { NextResponse } from 'next/server';

type CardData = {
  id: number;
  image: string;
  image2?:string,
  title: string;
  description: string;
  info: string;
  buttonText: string;
};

// Generate dummy cards
const generateCards = (): CardData[] => {
  const cards: CardData[] = [];
  for (let i = 1; i <= 100; i++) {
    cards.push({
      id: i,
      image: `https://via.placeholder.com/300x200?text=Card+${i}`,
      image2:`https://picsum.photos/300/200.webp?random=${i}`,
      title: `Card ${i}`,
      description: `This is the description for card ${i}.`,
      info: `Additional info about card ${i}.`,
      buttonText: 'Click Me',
    });
  }
  return cards;
};

const cards = generateCards();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const paginatedCards = cards.slice(offset, offset + limit);

  return NextResponse.json({
    offset,
    limit,
    total: cards.length,
    data: paginatedCards,
  });
}
