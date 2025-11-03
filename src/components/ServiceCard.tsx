import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  images: string[];
}

export default function ServiceCard({ title, icon, description, images }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        onClick={openModal}
        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer p-6 border-2 border-transparent hover:border-wood-400"
      >
        <div className="flex justify-center mb-4 text-wood-600">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-wood-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-600 text-center leading-relaxed">{description}</p>
        <button className="mt-4 w-full bg-wood-600 hover:bg-wood-700 text-white py-2 rounded-lg transition-colors text-sm font-medium">
          View Gallery
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-wood-400 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-6 bg-wood-800 text-white">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-cream-200 mt-2">{description}</p>
              </div>

              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={`${title} ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-wood-800 bg-opacity-75 hover:bg-opacity-100 text-white rounded-full p-2 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-wood-800 bg-opacity-75 hover:bg-opacity-100 text-white rounded-full p-2 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-wood-800 bg-opacity-75 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-wood-600' : 'border-gray-300 hover:border-wood-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
