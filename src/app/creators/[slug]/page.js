'use client';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function CreatorPage() {
  return (
    <>
      <Head>
        <title>Креатор 1</title>
        <meta name="description" content="Страница креатора проекта" />
      </Head>
      
      <div className="min-h-screen bg-black text-[#00FFAA] flex flex-col items-center">
        {/* Шапка сайта */}
        <div className="w-full h-32 bg-black flex items-center justify-center">
          <Image 
            src="/png8.png" 
            alt="Header" 
            width={1200} 
            height={200} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Навигация */}
        <nav className="w-full bg-[#0A192F] text-xl font-bold flex justify-center space-x-10 py-4 border-b border-[#00FFAA]">
          <Link href="/"><span className="hover:underline hover:text-[#00FFCC]">ДОМ</span></Link>
          <Link href="/projects"><span className="hover:underline hover:text-[#00FFCC]">ПРОЕКТЫ</span></Link>
          <Link href="/gallery"><span className="hover:underline hover:text-[#00FFCC]">ГАЛЕРЕЯ</span></Link>
          <Link href="/creators"><span className="hover:underline hover:text-[#00FFCC]">КРЕАТОРЫ</span></Link>
          <Link href="/contacts"><span className="hover:underline hover:text-[#00FFCC]">КОНТАКТЫ</span></Link>
          <Link href="/news"><span className="hover:underline hover:text-[#00FFCC]">НОВОСТИ</span></Link>
        </nav>

        {/* Основное содержимое */}
        <div className="max-w-4xl w-full px-4 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#00FFAA] flex-shrink-0">
              <Image
                src="/png14.png"
                alt="Креатор 1"
                width={256}
                height={256}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-4">Александр</h1>
              <p className="text-lg mb-4">Роль в проекте:Художник</p>
              <p className="text-[#00FFAA]">Занимается созданием спрайтов и анимации.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-[#00FFAA] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Работы</h2>
              <ul className="space-y-2">
                <li>• FOREST IS MY HOME</li>
                <li>• PANOPTICON</li>
                <li>• TBH</li>
              </ul>
            </div>

            <div className="border-2 border-[#00FFAA] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Контакты</h2>
              <div className="flex justify-center space-x-6">
                {['Tg:username123',  'alex.sharb4@gmail.com'].map((social, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="text-[#00FFAA] hover:text-[#00FFCC] transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Футер */}
        <footer className="flex justify-center space-x-10 pb-10 mt-auto">
          {[...Array(6)].map((_, i) => (
            <a 
              key={i} 
              href="#" 
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