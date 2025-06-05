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
    '/survival'
  ];

  const gameImages = [
    '/png9.png',  // для minesweeper
    '/png10.png', // для tetris
    '/png11.png', // для pingpong
    '/png12.png', // для tamagotchi
    '/png13.png'  // для survival
  ];

  const socialLinks = [
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com'
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
    <div className="min-h-screen bg-black text-[#00FFAA]">
      {/* Шапка сайта */}
      <div className="w-full h-32 bg-black flex items-center justify-center">
        <Image 
          src="/png8.png" 
          alt="Header" 
          width={1200} 
          height={200} 
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Навигация и аватарка */}
      <div className="w-full bg-[#0A192F] flex items-center justify-between px-4 border-b border-[#00FFAA]">
        <Link href="/" className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00FFAA] my-2">
            <Image 
              src="/png7.png" 
              alt="Avatar" 
              width={96} 
              height={96} 
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </Link>

        <nav className="text-xl font-bold flex justify-center space-x-10 py-4">
          <Link href="/"><span className="hover:underline hover:text-[#00FFCC]">ДОМ</span></Link>
          <Link href="/projects"><span className="hover:underline hover:text-[#00FFCC]">ПРОЕКТЫ</span></Link>
          <Link href="/gallery"><span className="hover:underline hover:text-[#00FFCC]">ГАЛЕРЕЯ</span></Link>
          <Link href="/creators"><span className="hover:underline hover:text-[#00FFCC]">КРЕАТОРЫ</span></Link>
          <Link href="/contacts"><span className="hover:underline hover:text-[#00FFCC]">КОНТАКТЫ</span></Link>
          <Link href="/news"><span className="hover:underline hover:text-[#00FFCC]">НОВОСТИ</span></Link>
        </nav>

        <div className="w-24 flex-shrink-0"></div>
      </div>

      {/* Игровые блоки */}
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
                alt={`Game ${i+1}`}
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

      {/* Соцсети */}
      <footer className="flex justify-center space-x-10 pb-10">
        {socialLinks.map((link, i) => (
          <a 
            key={i} 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200"
          >
            <Image 
              src={`/png${i+1}.png`} 
              alt={`Social ${i+1}`} 
              width={52} 
              height={52} 
              className="brightness-110 hover:brightness-125"
              priority
            />
          </a>
        ))}
      </footer>
    </div>
  );
}