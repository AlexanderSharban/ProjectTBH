'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [opened, setOpened] = useState([false, false, false, false, false]);

  const gameLinks = [
    '/minesweeper',
    '/tetris',
    '/pingpong',
    '/tamagotchi',
    '/survival',
  ];

  const gameImages = [
    '/png9.png', // для minesweeper
    '/png10.png', // для tetris
    '/png11.png', // для pingpong
    '/png12.png', // для tamagotchi
    '/png13.png', // для survival
  ];

  const handleClick = (index) => {
    if (!opened[index]) {
      window.open('https://google.com', '_blank');
      setOpened((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
    }
  };

  return (
    <section className="grid grid-cols-5 gap-4 px-8 py-16">
      {[...Array(5)].map((_, i) => (
        opened[i] ? (
          <Link
            key={i}
            href={gameLinks[i]}
            className="bg-black border-2 border-[#00FFAA] rounded-lg h-[32rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition hover:border-[#00FFCC] relative overflow-hidden group"
          >
            <Image
              src={gameImages[i]}
              alt={`Game ${i + 1}`}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>
        ) : (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className="bg-black border-2 border-[#00FFAA] rounded-lg h-[32rem] flex items-center justify-center cursor-pointer hover:opacity-90 transition hover:border-[#00FFCC]"
          >
            <div className="w-full h-full bg-blue-900 bg-opacity-50 flex items-center justify-center text-4xl">
              🔒
            </div>
          </div>
        )
      ))}
    </section>
  );
}