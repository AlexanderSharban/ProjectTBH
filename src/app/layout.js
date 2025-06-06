import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TBH",
  description: "Творческая студия",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TBH",
    description: "Творческая студия",
    url: "https://tbh.studio",
    siteName: "TBH",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ru-RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  const socialLinks = [
    "https://nodejs.org/en",
    "https://git-scm.com/",
    "https://google.com",
    "https://google.com",
    "https://google.com",
    "https://google.com",
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-[#00FFAA]`}
      >
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

          <nav className="text-xl font-bold flex justify-center space-x-10 py-4 text-[#00FFAA]">
            <Link href="/">
              <span className="hover:underline hover:text-[#00FFCC]">
                ДОМ
              </span>
            </Link>
            <Link href="/projects">
              <span className="hover:underline hover:text-[#00FFCC]">
                ПРОЕКТЫ
              </span>
            </Link>
            <Link href="/gallery">
              <span className="hover:underline hover:text-[#00FFCC]">
                ГАЛЕРЕЯ
              </span>
            </Link>
            <Link href="/creators">
              <span className="hover:underline hover:text-[#00FFCC]">
                КРЕАТОРЫ
              </span>
            </Link>
            <Link href="/contacts">
              <span className="hover:underline hover:text-[#00FFCC]">
                КОНТАКТЫ
              </span>
            </Link>
            <Link href="/news">
              <span className="hover:underline hover:text-[#00FFCC]">
                НОВОСТИ
              </span>
            </Link>
          </nav>

          <div className="w-24 flex-shrink-0"></div>
        </div>

        {/* Контент страниц */}
        <main>{children}</main>

        {/* Футер с соцсетями */}
        <footer className="flex justify-center space-x-10 pb-10 text-[#00FFAA]">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <Image
                src={`/png${i + 1}.png`}
                alt={`Social ${i + 1}`}
                width={52}
                height={52}
                className="brightness-110 hover:brightness-125"
                priority
              />
            </a>
          ))}
        </footer>
      </body>
    </html>
  );
}