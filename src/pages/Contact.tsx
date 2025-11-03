import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import { config } from '../config';

export default function Contact() {
  const handleCall = () => {
    window.location.href = `tel:${config.business.phone}`;
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(config.whatsappMessage);
    window.open(`https://wa.me/${config.business.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-wood-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ready to start your woodworking project? Contact us today for a free consultation and quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-wood-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-wood-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-wood-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wood-900 mb-1">Phone</h3>
                    <a href={`tel:${config.business.phone}`} className="text-gray-700 hover:text-wood-600 transition-colors">
                      {config.business.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-wood-100 p-3 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-wood-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wood-900 mb-1">WhatsApp</h3>
                    <button onClick={handleWhatsApp} className="text-gray-700 hover:text-wood-600 transition-colors">
                      {config.business.whatsapp}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-wood-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-wood-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wood-900 mb-1">Address</h3>
                    <p className="text-gray-700 leading-relaxed">{config.business.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-wood-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-wood-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wood-900 mb-1">Working Hours</h3>
                    <p className="text-gray-700">{config.business.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-wood-900 mb-4">Prefer to reach out directly?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleCall}
                    className="flex-1 bg-wood-600 hover:bg-wood-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
              <iframe
                src={config.business.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Workshop Location"
              ></iframe>
            </div>
          </div>

          <div className="bg-gradient-to-r from-wood-600 to-wood-700 rounded-lg shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Imran Pasha Wood Works?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-4xl font-bold text-wood-200 mb-2">10+</div>
                <p className="text-cream-100">Years of Experience</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-wood-200 mb-2">500+</div>
                <p className="text-cream-100">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-wood-200 mb-2">100%</div>
                <p className="text-cream-100">Quality Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-wood-800 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a Project in Mind?</h2>
            <p className="text-cream-200 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Whether it's a single piece of furniture or a complete home makeover, we're here to help.
              Get in touch today and let's discuss how we can bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCall}
                className="bg-white hover:bg-cream-100 text-wood-800 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-xl"
              >
                <Phone className="w-5 h-5" />
                <span>Call {config.business.phone}</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
