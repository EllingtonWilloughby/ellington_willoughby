'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/context/ColorSchemeContext';
import { HomeRounded } from '@mui/icons-material';

export default function Shows() {
  const { darkMode } = useDarkMode();

  return (
    <div className="min-h-screen w-screen max-w-screen-lg mx-auto flex flex-col justify-center items-center p-24">
      {
        darkMode
          ? (
            <Image src="/images/shows_dk.svg" height={500} width={500} alt="shows heading" className="-mt-20 -mb-20" />
          ) : (
            <Image src="/images/shows.svg" height={500} width={500} alt="shows heading" className="-mt-20 -mb-20" />
          )
      }
       <Link href="/" className="absolute top-8 left-8 text-sm"><HomeRounded/></Link>
      </div>
  );

}
