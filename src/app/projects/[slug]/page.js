import Link from 'next/link';
import Image from 'next/image';

// Данные проекта (можно вынести в отдельный файл)
const projectsData = {
  'forest-is-my-home': {
    title: 'FOREST IS MY HOME',
    description: 'ИГРА НА ЮНИТИ',
    images: ['/project1-1.jpg', '/project1-2.jpg', '/project1-3.png'],
    details: 'The Forest is my home - это 2D TopDown проект. В игре Вам предстоит боротся за существование, сражатся с враждебными мобами и построить своё поселение. Игра в жанре Survival RPG, так же в игре планируется сделать несколько игровых режимов, поэтому скучать точно не прийдется.'
  },
  'panopticon': {
    title: 'PANOPTICON',
    description: 'ДЕБЮТНЫЙ ПРОЕКТ',
    images: ['/project2-1.png'],
    details: 'Разработка засекречена, не будем портить сюрприз. Но могу сказать, что это будет история, посвященная наблюдению и контролю в современном обществе. Вдохновлен концепцией паноптикума Джереми Бентама.'
  },
  'brandbook': {
    title: 'BRANDBOOK',
    description: 'РАЗРАБОТКА ФИРМЕННОГО СТИЛЯ',
    images: ['/project3-1.jpg', '/project3-2.jpg'],
    details: 'Бренд представляет собой моё независимое предприятие, сосредоточенное на создании иллюстраций, концептуального искусства и комиксов. Разрабатывая визуальный стиль и логотип, я стремился передать истинную сущность того, чем занимаются люди за этим брендом. В качестве логотипа — вопреки всем установленным нормам — я выбрал детализированный рисунок, а не упрощенный символ, что, как правило, рекомендуется. Для основного шрифта я выбрал Comic Sans — шрифт, который часто не рекомендуется использовать в брендинге, — однако он остается незаменимым в мире комиксов.'
  }
};

// Динамическая генерация метаданных
export async function generateMetadata({ params }) {
  const project = projectsData[params.slug];
  return {
    title: project?.title || 'Проект',
    description: project?.description || 'Описание проекта',
  };
}

export default function ProjectPage({ params }) {
  const project = projectsData[params.slug];

  if (!project) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-[#00FFAA] text-center">Проект не найден</div>;
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-16 text-[#00FFAA] flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-[#00FFAA] text-center">{project.title}</h1>
      <p className="text-2xl mb-8 text-[#00FFCC] text-center">{project.description}</p>

      {/* Галерея проекта */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full">
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

      {/* Описание проекта */}
      <div className="prose prose-invert max-w-none mb-12 text-[#00FFAA] text-center">
        <p className="text-lg">{project.details}</p>
      </div>

      <Link
        href="/projects"
        className="px-6 py-3 bg-[#00FFAA] text-black font-bold rounded-lg hover:bg-[#00FFCC] transition-colors"
      >
        НАЗАД К ПРОЕКТАМ
      </Link>
    </div>
  );
}