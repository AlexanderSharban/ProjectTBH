'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function Gallery() {
  const galleryImages = [
    '/gallery1.jpg',
    '/gallery2.jpg',
    '/gallery3.jpg',
    '/gallery4.jpg',
    '/gallery5.jpg',
    '/gallery6.jpg',
    '/gallery7.jpg',
    '/gallery8.jpg',
    '/gallery9.jpg',
    '/gallery10.jpg',
  ];

    const socialLinks = [
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com',
    'https://google.com'
  ];
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const openImage = (index) => {
    setSelectedImage(galleryImages[index]);
    setCurrentIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigate = (direction) => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + galleryImages.length) % galleryImages.length
      : (currentIndex + 1) % galleryImages.length;
    
    setSelectedImage(galleryImages[newIndex]);
    setCurrentIndex(newIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(0.5, scale + delta), 3);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  return (
    <>
      <Head>
        <title>Галерея</title>
        <meta name="description" content="Галерея работ проекта" />
      </Head>
      
      <div className="min-h-screen bg-black text-[#00FFAA] flex flex-col">
        {/* Шапка и навигация (остаётся без изменений) */}

        {/* Основное содержимое */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-center">ГАЛЕРЕЯ</h1>
          
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-8">
            {galleryImages.map((img, index) => (
              <div 
                key={index} 
                className="break-inside-avoid cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openImage(index)}
              >
                <Image
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  width={300}
                  height={400}
                  className="w-full h-auto rounded-lg border-2 border-[#00FFAA]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Футер (остаётся без изменений) */}

        {/* Модальное окно с улучшенным функционалом */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <button 
              onClick={closeImage}
              className="absolute top-4 right-4 text-[#00FFAA] text-4xl hover:text-[#00FFCC] z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              &times;
            </button>
            
            <button 
              onClick={() => navigate('prev')}
              className="absolute left-4 text-[#00FFAA] text-4xl hover:text-[#00FFCC] z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              &#10094;
            </button>
            
            <div 
              className="relative max-w-full max-h-[90vh] overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              ref={imageRef}
            >
              <div
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Image
                  src={selectedImage}
                  alt="Selected gallery image"
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <button 
              onClick={() => navigate('next')}
              className="absolute right-4 text-[#00FFAA] text-4xl hover:text-[#00FFCC] z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              &#10095;
            </button>

            {/* Панель управления масштабом */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
              <button 
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="bg-[#0A192F] text-[#00FFAA] px-4 py-2 rounded hover:bg-[#00FFAA] hover:text-black"
              >
                -
              </button>
              <button 
                onClick={resetZoom}
                className="bg-[#0A192F] text-[#00FFAA] px-4 py-2 rounded hover:bg-[#00FFAA] hover:text-black"
              >
                {Math.round(scale * 100)}%
              </button>
              <button 
                onClick={() => setScale(Math.min(3, scale + 0.1))}
                className="bg-[#0A192F] text-[#00FFAA] px-4 py-2 rounded hover:bg-[#00FFAA] hover:text-black"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}