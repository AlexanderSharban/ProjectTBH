'use client';
import Link from 'next/link';
import Image from 'next/image';

const projects = [
  { 
    title: 'FOREST IS MY HOME', 
    slug: 'forest-is-my-home',
    image: '/project1.jpg',
    description: 'ИГРА НА ЮНИТИ',
    details: 'Попытки в GameDev'
  },
  { 
    title: 'PANOPTICON', 
    slug: 'panopticon',
    image: '/project2.png',
    description: 'НАБЛЮДЕНИЯ О КОНТРОЛЕ',
    details: 'Дебютный проект'
  },
  { 
    title: 'BRANDBOOK', 
    slug: 'brandbook',
    image: '/project3.jpg',
    description: 'РАЗРАБОТКА ФИРМЕННОГО СТИЛЯ',
    details: 'Создание целостного визуального языка для креативного объединения'
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
      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold mb-12">ПРОЕКТЫ</h1>
        
        {/* Список проектов в стиле новостей */}
        <div className="w-full max-w-4xl space-y-12">
          {projects.map((project, index) => (
            <div key={index} className="group border-2 border-[#00FFAA] rounded-lg overflow-hidden hover:border-[#00FFCC] transition-colors">
              <Link href={`/projects/${project.slug}`} className="flex flex-col md:flex-row">
                {/* Изображение проекта */}
                <div className="w-full md:w-1/3 h-48 relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Описание проекта */}
                <div className="w-full md:w-2/3 p-6 bg-[#0A192F]">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#00FFCC] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-xl mb-2 text-[#00FFCC]">
                    {project.description}
                  </p>
                  <p className="text-lg mb-4">
                    {project.details}
                  </p>
                  <span className="text-[#00FFAA] font-bold group-hover:text-[#00FFCC] transition-colors">
                    Подробнее →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Соцсети */}
      <footer className="flex justify-center space-x-10 py-10">
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