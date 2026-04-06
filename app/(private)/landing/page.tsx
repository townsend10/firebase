"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Ícones, instale lucide-react se não tiver

// Se você não tem lucide-react, pode usar um SVG simples ou um `<span>`
// Exemplo:
// const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
// const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

interface CarouselImage {
  id: number;
  alt: string;
  src: string;
}

const images: CarouselImage[] = [
  {
    id: 1,
    alt: "Aurora Boreal na Islândia",
    src: "https://images.unsplash.com/photo-1534720993954-46ac2ce32776?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    alt: "Veneza ao entardecer",
    src: "https://images.unsplash.com/photo-1527668700201-90184e93d8b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    alt: "Floresta tropical exuberante",
    src: "https://images.unsplash.com/photo-1517487842669-e08c0282b0f4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    alt: "Deserto com dunas infinitas",
    src: "https://images.unsplash.com/photo-1549725964-b81628d06c52?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    alt: "Horizonte de cidade moderna",
    src: "https://images.unsplash.com/photo-1589182372202-b2f567083076?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    alt: "Montanhas nevadas e lago azul",
    src: "https://images.unsplash.com/photo-1531366936337-b76e82a93910?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function AnimatedHorizontalCarousel() {
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  // Calcula a largura de um item para o offset de translação
  useEffect(() => {
    if (carouselTrackRef.current) {
      const firstItem = carouselTrackRef.current.children[0] as HTMLElement;
      if (firstItem) {
        // Pega a largura do item + o gap (se o gap for fixo, some aqui)
        // Aqui estamos considerando o gap do `gap-8` do tailwind, então medimos o próprio item
        setItemWidth(firstItem.offsetWidth);
      }
    }
  }, []);

  // Funções de navegação
  const goToIndex = useCallback(
    (index: number) => {
      if (carouselTrackRef.current && itemWidth > 0) {
        // Garante que o índice não saia dos limites
        const newIndex = Math.max(0, Math.min(index, images.length - 1));
        carouselTrackRef.current.style.transform = `translateX(-${newIndex * (itemWidth + 32)}px)`; // +32px para o gap-8 (8 * 4 = 32)
        setCurrentIndex(newIndex);
      }
    },
    [itemWidth],
  );

  const goToNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const goToPrev = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  // Evento de scroll do mouse (roda)
  useEffect(() => {
    const el = carouselTrackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();

      // Determina a direção do scroll
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goToNext, goToPrev]);

  return (
    <div className="w-full bg-zinc-950 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h2 className="text-4xl font-extrabold text-white mb-2">
          Jornada Visual
        </h2>
        <p className="text-zinc-400 text-lg">Descubra lugares incríveis</p>
      </div>

      <div className="relative">
        <div
          ref={carouselTrackRef}
          className="flex gap-8 px-[10vw] transition-transform duration-700 ease-in-out" // Animação via CSS
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="flex-shrink-0 w-[80vw] sm:w-[500px] aspect-video relative rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80vw, 500px"
                priority={image.id === 1} // Otimiza a primeira imagem
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{image.alt}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Botões de Navegação */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === images.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Indicadores de Posição */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 mt-8 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-gray-500 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
