'use client';

import Image from 'next/image';
import { Link } from '@/typings';

const LinkCard: React.FC<Link> = ({ href, title, image }) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='flex gap-2 items-center max-h-14 p-2 w-full rounded-md hover:scale-105 transition-all bg-gray-100'
    >
      <div className='flex items-center w-9 object-fit bg-gray-200 rounded-lg p-0.5 aspect-square object-cover'>
        {image && (
          <Image
            className='rounded-sm'
            alt={title}
            src={image}
            width={100}
            height={100}
          />
        )}
      </div>
      <div className='text-center line-clamp-1 font-semibold w-full leading-9 text-black'>
        {title}
      </div>
    </a>
  );
};

export default LinkCard;