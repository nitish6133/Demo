import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { config } from '../config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood-900 text-cream-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-wood-400 mb-4">{config.business.name}</h3>
            <p className="text-sm text-cream-200 leading-relaxed">
              {config.business.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-wood-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-wood-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-cream-200">{config.business.address}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-wood-400" />
                <a href={`tel:${config.business.phone}`} className="text-sm hover:text-wood-400 transition-colors">
                  {config.business.phone}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-wood-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-cream-200">{config.business.workingHours}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-wood-400">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
                    className="text-sm hover:text-wood-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-wood-700 mt-8 pt-8 text-center">
          <p className="text-sm text-cream-300">
            &copy; {currentYear} {config.business.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
