import { Phone, MessageCircle } from 'lucide-react';
import { config } from '../config';

export default function FloatingButtons() {
  const handleCall = () => {
    window.location.href = `tel:${config.business.phone}`;
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(config.whatsappMessage);
    window.open(`https://wa.me/${config.business.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <button
        onClick={handleCall}
        className="fixed bottom-24 right-4 md:right-8 bg-wood-600 hover:bg-wood-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 z-40 group"
        aria-label="Call now"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-wood-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Call Now
        </span>
      </button>

      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-4 md:right-8 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 z-40 group"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-green-700 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp
        </span>
      </button>
    </>
  );
}
