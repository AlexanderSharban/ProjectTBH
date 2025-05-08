"use client"
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl">Проект: {slug}</h1>
    </div>
  );
}