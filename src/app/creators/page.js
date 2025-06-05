'use client';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function Creators() {
  const creatorLinks = [
    '/creators/1', // Первый креатор
    '#', // Остальные пока неактивны
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#',
    '#'
  ];

  return (
    <>
      <Head>
        <title>Креаторы</title>
        <meta name="description" content="Список участников проекта и краткая информация о них" />
      </Head>
      
      <div className="min-h-screen bg-black text-[#00FFAA] flex flex-col items-center justify-start py-16">
        {/* Шапка сайта (как на главной) */}
        <div className="w-full h-32 bg-black flex items-center justify-center mb-8">
          <Image 
            src="/png8.png" 
            alt="Header" 
            width={1200} 
            height={200} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Навигация (как на главной) */}
        <nav className="w-full bg-[#0A192F] text-xl font-bold flex justify-center space-x-10 py-4 border-b border-[#00FFAA] mb-12">
          <Link href="/"><span className="hover:underline hover:text-[#00FFCC]">ДОМ</span></Link>
          <Link href="/projects"><span className="hover:underline hover:text-[#00FFCC]">ПРОЕКТЫ</span></Link>
          <Link href="/gallery"><span className="hover:underline hover:text-[#00FFCC]">ГАЛЕРЕЯ</span></Link>
          <Link href="/creators"><span className="hover:underline hover:text-[#00FFCC]">КРЕАТОРЫ</span></Link>
          <Link href="/contacts"><span className="hover:underline hover:text-[#00FFCC]">КОНТАКТЫ</span></Link>
          <Link href="/news"><span className="hover:underline hover:text-[#00FFCC]">НОВОСТИ</span></Link>
        </nav>

        <h1 className="text-4xl font-bold mb-10 text-[#00FFAA]">КРЕАТОРЫ</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 w-full max-w-6xl">
          {/* Первая ячейка с png14 */}
          <Link 
            href={creatorLinks[0]} 
            className="h-48 border-2 border-[#00FFAA] rounded-lg flex items-center justify-center overflow-hidden hover:border-[#00FFCC] transition-colors"
          >
            <Image
              src="/png14.png"
              alt="Креатор 1"
              width={300}
              height={300}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Остальные ячейки с замками */}
          {[...Array(27)].map((_, i) => (
            <div
              key={i+1}
              className="h-48 border-2 border-[#00FFAA] rounded-lg flex items-center justify-center text-4xl bg-[#001515] hover:border-[#00FFCC] transition-colors"
            >
              🔒
            </div>
          ))}
        </div>

        {/* Футер с соцсетями (как на главной) */}
        <footer className="flex justify-center space-x-10 pb-10 mt-16">
          {[...Array(6)].map((_, i) => (
            <a 
              key={i} 
              href="https://google.com" 
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
              />
            </a>
          ))}
        </footer>
      </div>
    </>
  );
}