import { Award, Heart, Users, MapPin } from 'lucide-react';
import { config } from '../config';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-wood-900 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Crafting quality furniture with passion and precision for over a decade
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-wood-900 mb-6">Meet Imran Pasha</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  With over 10 years of dedicated experience in woodworking and interior design,
                  Imran Pasha has established himself as a trusted name in Manikonda and surrounding areas.
                </p>
                <p>
                  What started as a passion for creating beautiful, functional pieces has grown into
                  a thriving business built on the principles of quality craftsmanship, attention to detail,
                  and customer satisfaction.
                </p>
                <p>
                  Every project we undertake is treated with the same care and dedication, whether it's
                  a small repair or a complete home interior. We believe that great furniture is not just
                  about aesthetics, but about creating pieces that enhance your daily life.
                </p>
                <p className="text-wood-800 font-medium">
                  {config.business.description}
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Imran Pasha at work"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Award className="w-12 h-12" />,
                title: '10+ Years',
                description: 'Of excellence in woodworking and interior design',
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: '500+ Projects',
                description: 'Successfully completed with satisfied customers',
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: '100% Dedication',
                description: 'To quality craftsmanship and customer satisfaction',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center text-wood-600 mb-4">{stat.icon}</div>
                <h3 className="text-2xl font-bold text-wood-900 mb-2">{stat.title}</h3>
                <p className="text-gray-600 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-wood-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-wood-900 mb-4 flex items-center justify-center space-x-3">
              <MapPin className="w-8 h-8" />
              <span>Visit Our Workshop</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Come see our craftsmanship in person. We're located in the heart of Manikonda.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-wood-900 mb-2">Address</h3>
                  <p className="text-gray-700 leading-relaxed">{config.business.address}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-wood-900 mb-2">Working Hours</h3>
                  <p className="text-gray-700">{config.business.workingHours}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-wood-900 mb-2">Contact</h3>
                  <p className="text-gray-700">
                    Phone: <a href={`tel:${config.business.phone}`} className="text-wood-600 hover:text-wood-700 font-medium">{config.business.phone}</a>
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-wood-600 hover:bg-wood-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Directions
                </a>
              </div>

              <div className="h-[400px] lg:h-auto">
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
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-wood-800 to-wood-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Create Something Beautiful Together</h2>
          <p className="text-cream-200 mb-8 text-lg leading-relaxed">
            Whether you have a clear vision or need guidance, we're here to help bring your ideas to life.
          </p>
          <a
            href="/contact"
            className="inline-block bg-wood-600 hover:bg-wood-700 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}
