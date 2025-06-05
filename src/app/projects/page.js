'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const projects = [
  { 
    title: 'FOREST IS MY HOME', 
    slug: 'forest-is-my-home',
    image: '/project1.jpg',
    description: 'ИГРА НА ЮНИТИ'
  },
  { 
    title: 'PANOPTICON', 
    slug: 'panopticon',
    image: '/project2.jpeg',
    description: 'НАБЛЮДЕНИЯ О КОНТРОЛЕ'
  },
  { 
    title: 'BRANDBOOK', 
    slug: 'brandbook',
    image: '/project3.jpg',
    description: 'РАЗРАБОТКА ФИРМЕННОГО СТИЛЯ'
  }
];

const socialLinks = [
  'https://google.com',
  'https://google.com',
  'https://google.com',
  'https://google.com',
  'https://google.com',
  'https://google.com'
];

export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevProject = () => {
    setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextProject = () => {
    setCurrentIndex(prev => (prev + 1) % projects.length);
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

      {/* Основное содержимое */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-12">ПРОЕКТЫ</h1>
        
        {/* Карусель проектов */}
        <div className="relative w-full max-w-4xl h-[600px] mb-16">
          {/* Кнопки навигации */}
          <button 
            onClick={prevProject}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-[#00FFAA] text-4xl hover:text-[#00FFCC] rounded-full w-12 h-12 flex items-center justify-center"
          >
            &larr;
          </button>
          
          <button 
            onClick={nextProject}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-[#00FFAA] text-4xl hover:text-[#00FFCC] rounded-full w-12 h-12 flex items-center justify-center"
          >
            &rarr;
          </button>

          {/* Карточка проекта */}
          <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-[#00FFAA] group">
            {/* Фоновое изображение */}
            <Image
              src={projects[currentIndex].image}
              alt={projects[currentIndex].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            
            {/* Затемнение и текст */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-8 text-center group-hover:bg-opacity-70 transition-all duration-300">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {projects[currentIndex].title}
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                {projects[currentIndex].description}
              </p>
              <Link 
                href={`/projects/${projects[currentIndex].slug}`}
                className="px-8 py-3 bg-[#00FFAA] text-black font-bold rounded-lg hover:bg-[#00FFCC] transition-colors"
              >
                ПОДРОБНЕЕ
              </Link>
            </div>
          </div>
        </div>

        {/* Индикаторы текущего проекта */}
        <div className="flex space-x-4 mb-16">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-[#00FFAA]' : 'bg-gray-500'}`}
            />
          ))}
        </div>
      </div>

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