'use client';
import { useState } from 'react';
import Link from 'next/link';



const projects = [
  { title: 'Проект 1', color: 'bg-blue-900', slug: 'proekt-1' },
  { title: 'Проект 2', color: 'bg-purple-900', slug: 'proekt-2' },
  { title: 'Проект 3', color: 'bg-indigo-900', slug: 'proekt-3' }
];

export default function ProjectsPage() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  return (
    <div className="min-h-screen bg-[#02051a] text-white flex flex-col items-center justify-center">
      <header className="w-full bg-[#0a0d20] py-4 px-8 flex justify-center gap-10 text-green-500 text-xl">
        {['ДОМ', 'ПРОЕКТЫ', 'ГАЛЛЕРЕЯ', 'КРЕАТОРЫ', 'КОНТАКТЫ', 'НОВОСТИ'].map((text, i) => (
          <Link key={i} href={`/${text.toLowerCase() === 'дом' ? '' : text.toLowerCase()}`}>
            <span className="hover:underline">{text}</span>
          </Link>
        ))}
      </header>

      <h1 className="text-3xl my-6">ПРОЕКТЫ</h1>

      <div className="relative w-[80%] max-w-4xl h-[500px] border-4 border-white p-4 flex items-center justify-center">
        <button onClick={prev} className="absolute left-4 text-4xl">⟵</button>

        <Link href={`/projects/${projects[index].slug}`} className="w-full h-full">
          <div className={`w-full h-full ${projects[index].color} flex items-center justify-center text-2xl cursor-pointer`}>
            {projects[index].title}
          </div>
        </Link>

        <button onClick={next} className="absolute right-4 text-4xl">⟶</button>
      </div>

      <div className="flex space-x-4 mt-8">
        {['TikTok', 'Telegram', 'VK', 'YouTube', 'Instagram', 'Discord'].map((name, i) => (
          <div key={i} className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xs">
            {name[0]}
          </div>
        ))}
      </div>
    </div>
  );
}
