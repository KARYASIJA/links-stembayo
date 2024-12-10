'use client';

import Image from 'next/image';
import data from '@/data';
import LinkCard from '@/app/components/LinkCard';
import LinkSocial from '@/app/components/LinkSocial';
import GoogleMapEmbed from './components/GoogleMap';
import Divider from './components/Divider';

export default function Home() {
  return (
    <div className='flex mx-auto main min-h-screen w-full flex-col'>
      <div className='flex items-center flex-col justify-center'>
        <Image
          className='z-0 max-h-60 lg:max-h-44 object-cover w-full'
          alt={data.name}
          src={data.banner}
          width={1500}
          height={500}
          loading='lazy'
        />
        <Image
          priority
          className='z-10 -mt-20 h-40 w-auto aspect-square'
          alt={data.name}
          src={data.avatar}
          width={200}
          height={200}
        />
        <div className='px-6 text-center'>
          <h1 className='font-bold mt-2 text-2xl text-black'>{data.name}</h1>
          <p className='mt-1 font-bold text-xl text-black'>
            {data.descriptionOne}
          </p>
          <p className='mt-1 italic text-black'>{data.descriptionTwo}</p>
          <div>
            <Divider title='Sekolah' />
              <div className='flex flex-col gap-3 items-center w-full'>
                {data.sectionOne.map((link) => (
                  <LinkCard key={link.href} {...link} />
                ))}
              </div>
            <Divider title='Lain-lain' />
              <div className='flex flex-col gap-3 items-center w-full'>
                {data.sectionTwo.map((link) => (
                  <LinkCard key={link.href} {...link} />
                ))}
              </div>
            <Divider title='Lokasi' />
            <GoogleMapEmbed />
            <Divider />
          </div>
          <div className='flex items-center justify-center gap-3 text-black'>
            {data.socials.map((social) => (
              <LinkSocial key={social.href} {...social} />
            ))}
          </div>
          <div className='flex justify-center my-8 text-black'>
            <span>&copy; 2024 Tim Karya Web STEMBAYO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
