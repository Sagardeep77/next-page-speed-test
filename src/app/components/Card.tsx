import Image from 'next/image';
import React from 'react';

type CardProps = {
  image: string;
  image2:string,
  title: string;
  description: string;
  info: string;
  buttonText: string;
  onActionClick?: () => void;
  lazyLoadImage?:boolean;
};

const Card = ({ image, image2, title, description, info, buttonText, onActionClick,lazyLoadImage } : CardProps) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">

        {/* images */}
        <img src={image2} alt={title} className="w-full h-48 object-cover" />
        {/* <img src={'/assets/1.webp'}
 alt={title} className="w-full h-48 object-cover" /> */}


  {/* loading from local */}
    

        {/* lazy load */}

        {/* <div className="relative h-48 w-full">
          <Image
            loading="lazy"
            src={image2}
            alt={title}
            layout="fill"
            objectFit="cover"  // Ensure the image covers the container while preserving its aspect ratio
            className="rounded-t-lg"
          />
        </div> */}

         

{/* <link rel="preload" fetchPriority="high" as="image" href='/assets/1.webp' type="image/webp"/> */}


        {/* eager loading upper 2 then lazty loading */}
        {/* {
          lazyLoadImage ? <div className="relative h-48 w-full">
          <Image
            loading="lazy"
            src={image2}
            alt={title}
            layout="fill"
            objectFit="cover"  // Ensure the image covers the container while preserving its aspect ratio
            className="rounded-t-lg"
          />
        </div>  : <div className="relative h-48 w-full">
        <Image
            
            loading='eager'
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"  // Ensure the image covers the container while preserving its aspect ratio
            className="rounded-t-lg"
          />
    </div>
        } */}


        {/* eagerly load */}

        {/* <div className="relative h-48 w-full">
          <Image
            loading="eager"
            src={image2}
            alt={title}
            layout="fill"
            objectFit="cover"  // Ensure the image covers the container while preserving its aspect ratio
            className="rounded-t-lg"
          />
        </div> */}

        

    
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
