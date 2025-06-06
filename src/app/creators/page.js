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
    '#',
  ];

  return (
    <>
      <Head>
        <title>Креаторы</title>
        <meta name="description" content="Список участников проекта и краткая информация о них" />
      </Head>
      
      <div className="flex flex-col items-center justify-start py-16 text-[#00FFAA]">
        <h1 className="text-4xl font-bold mb-10 text-[#00FFAA]">КРЕАТОРЫ</h1>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 px-4 w-full max-w-6xl">
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
              key={i + 1}
              className="h-48 border-2 border-[#00FFAA] rounded-lg flex items-center justify-center text-4xl bg-[#001515] hover:border-[#00FFCC] transition-colors text-[#00FFAA]"
            >
              🔒
            </div>
          ))}
        </div>
      </div>
    </>
  );
}