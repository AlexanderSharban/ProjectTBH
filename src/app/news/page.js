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

export const metadata = {
  title: 'Новости',
  description: 'Список новостей творческой студии',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-16 text-[#00FFAA] flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-[#00FFAA] text-center">В СКОРОМ БУДУЩЕМ!</h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-11">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group border-2 border-[#00FFAA] rounded-lg overflow-hidden hover:border-[#00FFCC] transition-colors flex flex-col"
          >
            <Link href={`/projects/${project.slug}`} className="flex flex-col h-full">
              <div className="w-full h-48 relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-4 bg-[#0A192F] flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-2 group-hover:text-[#00FFCC] transition-colors text-center">
                  {project.title}
                </h2>
                <p className="text-sm mb-1 text-[#00FFCC] text-center">
                  {project.description}
                </p>
                <p className="text-xs mb-2 text-[#00FFAA] text-center">
                  {project.details}
                </p>
                <div className="text-center mt-auto">
                  <span className="text-sm text-[#00FFAA] font-bold group-hover:text-[#00FFCC] transition-colors">
                    Подробнее →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}