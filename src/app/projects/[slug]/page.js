'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectPage({ params }) {
  // Данные проекта (можно вынести в отдельный файл)
  const projectsData = {
    'forest-is-my-home': {
      title: 'FOREST IS MY HOME',
      description: 'ИГРА НА ЮНИТИ',
      images: ['/project1-1.jpg', '/project1-2.jpg', '/project1-3.png'],
      details: 'The Forest is my home - это 2D TopDown проект, от Российских разработчиков. В игре Вам предстоит боротся за существование, сражатся с враждебными мобами и построить своё поселение. Игра в жанре Survival RPG, так же в игре планируется сделать несколько игровых режимов, поэтому скучать точно не прийдется.'
    },
    'panopticon': {
      title: 'PANOPTICON',
      description: 'ДЕБЮТНЫЙ ПРОЕКТ',
      images: ['/project2-1.png'],
      details: 'Разработка засекречена, не будем портить сюрприз. Но могу сказать, что это будет интерактивная инсталляция, посвященная наблюдению и контролю в современном обществе. Вдохновлен концепцией паноптикума Джереми Бентама.'
    },
    'brandbook': {
      title: 'BRANDBOOK',
      description: 'РАЗРАБОТКА ФИРМЕННОГО СТИЛЯ',
      images: ['/project3-1.jpg', '/project3-2.jpg'],
      details: 'Бренд представляет собой моё независимое предприятие, сосредоточенное на создании иллюстраций, концептуального искусства и комиксов. Разрабатывая визуальный стиль и логотип, я стремился передать истинную сущность того, чем занимаются люди за этим брендом. В качестве логотипа — вопреки всем установленным нормам — я выбрал детализированный рисунок, а не упрощенный символ, что, как правило, рекомендуется. Для основного шрифта я выбрал Comic Sans — шрифт, который часто не рекомендуется использовать в брендинге, — однако он остается незаменимым в мире комиксов.'
    }
  };

  const project = projectsData[params.slug];

  if (!project) {
    return <div>Проект не найден</div>;
  }

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

      {/* Навигация */}
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

      {/* Контент проекта */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        <p className="text-2xl mb-8 text-[#00FFCC]">{project.description}</p>
        
        {/* Галерея проекта */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {project.images.map((img, index) => (
            <div key={index} className="relative aspect-video border-2 border-[#00FFAA] rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`${project.title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Описание прое */}
        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-lg">{project.details}</p>
        </div>

        <Link 
          href="/projects"
          className="px-6 py-3 bg-[#00FFAA] text-black font-bold rounded-lg hover:bg-[#00FFCC] transition-colors"
        >
          НАЗАД К ПРОЕКТАМ
        </Link>
      </div>

      {/* Футер */}
      <footer className="flex justify-center space-x-10 pb-10 mt-12">
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
  );
}