import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { heroSlides } from "../config/site";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

const buttonStyles = {
  primary: "bg-gradient-to-r from-secondary to-primary text-white shadow-lg hover:opacity-90",
  outline: "bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-primary",
};

function Slide({ slide, active }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      {slide.image ? (
        <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
      <div className="absolute top-8 left-8 w-56 h-56 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none dot-bg" />

      <div className="relative z-10 h-full flex items-center pb-24 sm:pb-16">
        <div className="container px-4 md:px-8 lg:px-16">
          <div
            className="max-w-xl lg:max-w-3xl font-nav transition-all duration-500"
            style={{ opacity: active ? 1 : 0.15, transform: active ? "none" : "translateX(-20px)" }}
          >
            {slide.tagline && (
              <p className="flex items-center mb-2 md:mb-4 text-[0.8rem] font-bold uppercase tracking-[0.28em]">
                <span className="inline-block w-6 h-0.5 mr-2 rounded-full bg-gradient-to-r from-secondary to-primary" />
                <span className="shimmer-text">{slide.tagline}</span>
              </p>
            )}
            <h1 className="font-display font-bold leading-[1.08] text-4xl sm:text-6xl md:text-7xl text-white mb-2 md:mb-3 drop-shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
              {slide.heading}
            </h1>
            {slide.description && (
              <p className="font-light leading-relaxed text-sm md:text-base lg:text-lg text-gray-200/90 mb-5 md:mb-8 max-w-lg">
                {slide.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 md:gap-4">
              {slide.buttons?.map((button) => (
                <Link
                  key={button.label}
                  to={button.link}
                  tabIndex={active ? 0 : -1}
                  draggable={false}
                  className={`inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    buttonStyles[button.style] || buttonStyles.outline
                  }`}
                >
                  {button.label}
                  <FaChevronRight className="text-[10px] opacity-80" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ stats }) {
  if (!stats?.length) return null;
  return (
    <div className="absolute bottom-20 sm:bottom-16 md:bottom-20 left-0 right-0 z-20 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/15 rounded-xl overflow-hidden border border-white/10 bg-black/25 backdrop-blur-md">
          {stats.map((stat) => (
            <div key={stat.label} className="py-3 px-4 text-center">
              <p className="font-display text-lg md:text-2xl font-bold text-white mb-0.5">{stat.number}</p>
              <p className="font-nav font-medium text-white/50 text-[9px] md:text-[10px] tracking-[2.5px] uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const arrowClass =
  "w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/35 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center hover:border-secondary hover:text-secondary transition-all duration-200 disabled:opacity-25 hover:scale-110";

export default function Hero({ stats }) {
  const slides = heroSlides;
  const [current, setCurrent] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const timer = useRef(null);
  const dragged = useRef(false);

  const restartAutoplay = useCallback(() => {
    clearInterval(timer.current);
    if (slides.length > 1) {
      timer.current = setInterval(() => setCurrent((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    }
  }, [slides.length]);

  useEffect(() => {
    restartAutoplay();
    return () => clearInterval(timer.current);
  }, [restartAutoplay]);

  const goTo = (index) => {
    setCurrent(Math.max(0, Math.min(index, slides.length - 1)));
    restartAutoplay();
  };

  const onPointerDown = (e) => {
    setDragStartX(e.clientX);
    setDragOffset(0);
    dragged.current = false;
    clearInterval(timer.current);
  };

  const onPointerMove = (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 8) dragged.current = true;
    // Rubber-band at either end
    const atEdge = (current === 0 && delta > 0) || (current === slides.length - 1 && delta < 0);
    setDragOffset(atEdge ? delta * 0.2 : delta);
  };

  const endDrag = () => {
    if (dragStartX === null) return;
    setDragStartX(null);
    if (dragOffset < -SWIPE_THRESHOLD_PX) goTo(current + 1);
    else if (dragOffset > SWIPE_THRESHOLD_PX) goTo(current - 1);
    else restartAutoplay();
    setDragOffset(0);
  };

  const dragging = dragStartX !== null;

  return (
    <div className="relative w-full overflow-hidden min-h-[620px] md:min-h-[700px] h-[82vh] lg:h-[88vh]">
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        // A swipe that started on a button shouldn't also follow its link
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.heading}
            className="absolute inset-0 w-full h-full will-change-transform"
            aria-hidden={index !== current}
            style={{
              transform: `translateX(calc(${index - current} * 100% + ${dragOffset}px))`,
              transition: dragging ? "none" : "transform 0.48s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <Slide slide={slide} active={index === current} />
          </div>
        ))}
      </div>

      <StatsBar stats={stats} />

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-30">
            <button onClick={() => goTo(current - 1)} disabled={current === 0} className={arrowClass} aria-label="Previous slide">
              <FaChevronLeft className="text-xs" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.heading}
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current ? "w-7 bg-gradient-to-r from-secondary to-primary" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} className={arrowClass} aria-label="Next slide">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="hidden sm:block absolute bottom-4 md:bottom-6 left-4 md:left-6 z-30 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 font-nav">
            <span className="text-white text-xs font-medium tracking-wider">
              {String(current + 1).padStart(2, "0")} <span className="opacity-40">/</span> {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
