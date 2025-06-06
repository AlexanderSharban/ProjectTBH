'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const projects = [
  {
    title: 'FOREST IS MY HOME',
    slug: 'forest-is-my-home',
    image: '/project1.jpg',
    description: 'ИГРА НА ЮНИТИ',
    details: 'Попытки в GameDev',
  },
  {
    title: 'PANOPTICON',
    slug: 'panopticon',
    image: '/project2.png',
    description: 'НАБЛЮДЕНИЯ О КОНТРОЛЕ',
    details: 'Дебютный проект',
  },
  {
    title: 'BRANDBOOK',
    slug: 'brandbook',
    image: '/project3.jpg',
    description: 'РАЗРАБОТКА ФИРМЕННОГО СТИЛЯ',
    details: 'Создание целостного визуального языка для креативного объединения',
  },
];



export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevProject = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-16 text-[#00FFAA] flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-[#00FFAA] text-center">ПРОЕКТЫ</h1>

      {/* Карусель проектов */}
      <div className="relative w-full max-w-4xl h-[600px] mb-16">
        {/* Кнопки навигации */}
        <button
          onClick={prevProject}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-[#00FFAA] text-4xl hover:text-[#00FFCC] rounded-full w-12 h-12 flex items-center justify-center"
        >
          ←
        </button>

        <button
          onClick={nextProject}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-[#00FFAA] text-4xl hover:text-[#00FFCC] rounded-full w-12 h-12 flex items-center justify-center"
        >
          →
        </button>

        {/* Карточка проекта */}
        <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-[#00FFAA]">
          {/* Фоновое изображение */}
          <Image
            src={projects[currentIndex].image}
            alt={projects[currentIndex].title}
            fill
            className="object-cover"
            priority
          />

          {/* Текст на полупрозрачном фоне */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl w-full">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#00FFAA]">
                {projects[currentIndex].title}
              </h2>
              <p className="text-xl md:text-2xl mb-6 text-[#00FFAA]">
                {projects[currentIndex].description}
              </p>
              <p className="text-lg mb-6 text-[#00FFCC]">
                {projects[currentIndex].details}
              </p>
              <Link
                href={`/projects/${projects[currentIndex].slug}`}
                className="inline-block px-8 py-3 bg-[#00FFAA] text-black font-bold rounded-lg hover:bg-[#00FFCC] transition-colors"
              >
                ПОДРОБНЕЕ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Индикаторы текущего проекта */}
      <div className="flex space-x-4 mb-16 justify-center">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-[#00FFAA]' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}