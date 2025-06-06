'use client';
import Link from 'next/link';
import Image from 'next/image';

const contacts = [
  {
    name: 'Электронная почта',
    value: 'alex.sharb4@gmail.com',
    link: 'mailto:alex.sharb4@gmail.com'
  },
  {
    name: 'Телефон',
    value: '5 555-55-55',
    link: 'tel:5555-55-55'
  },
  {
    name: 'Telegram',
    value: '@username123',
    link: 'https://t.me/username123'
  },
  {
    name: 'Локация',
    value: 'Нейтральные воды (0°N 0°E)',
    link: 'https://www.google.com/maps/place/0°00\'00.0"N+0°00\'00.0"E'
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

export default function ContactsPage() {
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
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-12">КОНТАКТЫ</h1>
        
        {/* Контактные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
          {contacts.map((contact, index) => (
            <div 
              key={index} 
              className="border-2 border-[#00FFAA] rounded-lg p-6 hover:bg-[#0A192F] transition-colors"
            >
              <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
              <a 
                href={contact.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg hover:text-[#00FFCC] transition-colors"
              >
                {contact.value}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Соцсети */}
            <footer className="flex justify-center space-x-10 pb-10">
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