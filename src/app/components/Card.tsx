import React from 'react';

type CardProps = {
  image: string;
  title: string;
  description: string;
  info: string;
  buttonText: string;
  onActionClick?: () => void;
};

const Card = ({ image, title, description, info, buttonText, onActionClick } : CardProps) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-sm text-gray-500 mb-4">{info}</p>
      <button
        // onClick={onActionClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

export default Card;
