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
  title: 'Проекты',
  description: 'Список проектов творческой студии',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-16 text-[#00FFAA] flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12 text-[#00FFAA] text-center">ПРОЕКТЫ</h1>

      {/* Список проектов */}
      <div className="w-full space-y-12">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group border-2 border-[#00FFAA] rounded-lg overflow-hidden hover:border-[#00FFCC] transition-colors"
          >
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
              <div className="w-full md:w-2/3 p-6 bg-[#0A192F] text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#00FFCC] transition-colors">
                  {project.title}
                </h2>
                <p className="text-xl mb-2 text-[#00FFCC]">
                  {project.description}
                </p>
                <p className="text-lg mb-4 text-[#00FFAA]">
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
  );
}