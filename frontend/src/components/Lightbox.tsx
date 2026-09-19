import React, { useEffect } from 'react';
import { GalleryImage } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      {/* Top Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="text-xs uppercase tracking-widest text-saffron-400 font-sans">
          Image {currentIndex + 1} of {images.length} • {currentImage.category}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-charcoal-800 text-cream-100 hover:bg-saffron-500 hover:text-charcoal-950 transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-800/80 text-cream-100 hover:bg-forest-800 hover:text-cream-50 transition-colors z-10"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-800/80 text-cream-100 hover:bg-forest-800 hover:text-cream-50 transition-colors z-10"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Display */}
      <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
        <img
          src={currentImage.imageUrl}
          alt={currentImage.title}
          className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl border border-charcoal-800"
        />
        <div className="mt-4 text-center">
          <h3 className="font-serif text-2xl font-bold text-cream-50">
            {currentImage.title}
          </h3>
          {currentImage.caption && (
            <p className="text-sm text-cream-300 font-sans mt-1 max-w-xl">
              {currentImage.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
