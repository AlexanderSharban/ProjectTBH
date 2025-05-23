'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [opened, setOpened] = useState([false, false, false, false, false]);

  const gamePaths = [
    '/minesweeper',
    '/tetris',
    '/pingpong',
    '/tamagotchi',
    '/survival'
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
    <div className="min-h-screen bg-[#02051a] text-white">
      <nav className="w-full bg-black text-green-500 text-xl font-bold flex justify-center space-x-10 py-4">
        <Link href="/"><span className="hover:underline">ДОМ</span></Link>
        <Link href="/projects"><span className="hover:underline">ПРОЕКТЫ</span></Link>
        <Link href="#"><span className="hover:underline">ГАЛЛЕРЕЯ</span></Link>
        <Link href="/creators"><span className="hover:underline">КРЕАТОРЫ</span></Link>
        <Link href="#"><span className="hover:underline">КОНТАКТЫ</span></Link>
        <Link href="#"><span className="hover:underline">НОВОСТИ</span></Link>
      </nav>

      <header className="p-4 bg-gray-800 w-full flex items-center justify-start">
        <div className="w-12 h-12 bg-gray-700 rounded-full" />
      </header>

      <section className="grid grid-cols-5 gap-2 px-4 py-16">
        {[...Array(5)].map((_, i) => (
          opened[i] ? (
            <Link
              key={i}
              href={gamePaths[i]}
              className="bg-black border border-white rounded-lg h-[32rem] flex items-center justify-center cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-full h-full bg-blue-900 bg-opacity-50 flex items-center justify-center text-2xl">
                Перейти в игру
              </div>
            </Link>
          ) : (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className="bg-black border border-white rounded-lg h-[32rem] flex items-center justify-center cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-full h-full bg-blue-900 bg-opacity-50 flex items-center justify-center text-4xl">
                🔒
              </div>
            </div>
          )
        ))}
      </section>

      <footer className="flex justify-center space-x-4 pb-8">
        {["TikTok", "Telegram", "Patreon", "YouTube", "Instagram", "Discord"].map((name, i) => (
          <div key={i} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">
            {name[0]}
          </div>
        ))}
      </footer>
    </div>
  );
}
