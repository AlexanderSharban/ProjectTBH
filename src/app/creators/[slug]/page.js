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
      <div className="max-w-4xl w-full px-4 py-16 text-[#00FFAA]">
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
            <h1 className="text-3xl font-bold mb-4 text-[#00FFAA]">Александр</h1>
            <p className="text-lg mb-4 text-[#00FFAA]">Роль в проекте: Художник</p>
            <p className="text-[#00FFAA]">Занимается созданием спрайтов и анимации.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-[#00FFAA] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#00FFAA]">Работы</h2>
            <ul className="space-y-2 text-[#00FFAA]">
              <li>• FOREST IS MY HOME</li>
              <li>• PANOPTICON</li>
              <li>• TBH</li>
            </ul>
          </div>

          <div className="border-2 border-[#00FFAA] rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#00FFAA]">Контакты</h2>
            <div className="flex justify-center space-x-6">
              {['Tg:username123', 'alex.sharb4@gmail.com'].map((social, i) => (
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
    </>
  );
}