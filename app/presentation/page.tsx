"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Slide1_Title from "@/components/presentation/slides/Slide1_Title";
import Slide2_Hook from "@/components/presentation/slides/Slide2_Hook";
import Slide3_Why from "@/components/presentation/slides/Slide3_Why";
import Slide4_Insights from "@/components/presentation/slides/Slide4_Insights";
import Slide5_Demo from "@/components/presentation/slides/Slide5_Demo";
import Slide6_Agent from "@/components/presentation/slides/Slide6_Agent";
import Slide7_Next from "@/components/presentation/slides/Slide7_Next";

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    Slide1_Title,
    Slide2_Hook,
    Slide3_Why,
    Slide4_Insights,
    Slide5_Demo,
    Slide6_Agent,
    Slide7_Next,
  ];

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div
      className="w-screen h-screen bg-black text-white overflow-hidden relative"
    >
      <div className="absolute inset-0" onClick={nextSlide}>
        <AnimatePresence mode="wait">
          <CurrentSlideComponent key={currentSlide} />
        </AnimatePresence>
      </div>

      <div className="fixed bottom-4 right-4 text-zinc-600 text-sm font-mono z-50">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
