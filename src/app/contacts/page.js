'use client';
import Link from 'next/link';

const contacts = [
  {
    name: 'Электронная почта',
    value: 'alex.sharb4@gmail.com',
    link: 'mailto:alex.sharb4@gmail.com',
  },
  {
    name: 'Телефон',
    value: '5 555-55-55',
    link: 'tel:5555-55-55',
  },
  {
    name: 'Telegram',
    value: '@username123',
    link: 'https://t.me/username123',
  },
  {
    name: 'Локация',
    value: 'Нейтральные воды (0°N 0°E)',
    link: 'https://www.google.com/maps/place/0°00\'00.0"N+0°00\'00.0"E',
  },
];

export default function ContactsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#00FFAA]">
      <h1 className="text-4xl font-bold mb-12 text-[#00FFAA]">КОНТАКТЫ</h1>

      {/* Контактные карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="border-2 border-[#00FFAA] rounded-lg p-6 hover:bg-[#0A192F] transition-colors"
          >
            <h3 className="text-xl font-bold mb-2 text-[#00FFAA]">{contact.name}</h3>
            <a
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-[#00FFAA] hover:text-[#00FFCC] transition-colors"
            >
              {contact.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}