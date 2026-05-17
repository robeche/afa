"use client";

import { useEffect, useMemo, useState } from "react";

import type { Lang } from "@/types/domain";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80",
    titleEs: "Participa en la vida del centro",
    titleEu: "Parte hartu ikastetxeko bizitzan",
  },
  {
    image: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=1400&q=80",
    titleEs: "Juntos por una escuela mejor",
    titleEu: "Elkarrekin eskola hobe baten alde",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80",
    titleEs: "Actividades para todas las familias",
    titleEu: "Familia guztientzako jarduerak",
  },
];

interface HeroCarouselProps {
  lang: Lang;
}

export function HeroCarousel({ lang }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const title = useMemo(() => {
    const slide = slides[activeIndex];
    return lang === "eu" ? slide.titleEu : slide.titleEs;
  }, [activeIndex, lang]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <div
        className="h-72 bg-cover bg-center transition-all duration-700 md:h-96"
        style={{ backgroundImage: `url(${slides[activeIndex].image})` }}
      >
        <div className="flex h-full items-end bg-gradient-to-t from-black/65 via-black/20 to-transparent p-6">
          <div>
            <p className="font-display text-2xl font-extrabold text-white md:text-4xl">{title}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-8 rounded-full transition ${
              activeIndex === index ? "bg-white" : "bg-white/45"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
