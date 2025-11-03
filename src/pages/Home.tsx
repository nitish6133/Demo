import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Play } from 'lucide-react';
import { config } from '../config';

export default function Home() {
  const [latestVideoId, setLatestVideoId] = useState<string | null>(null);
  console.log("latestVideoId", latestVideoId)

  const handleCall = () => {
    window.location.href = `tel:${config.business.phone}`;
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(config.whatsappMessage);
    window.open(
      `https://wa.me/${config.business.whatsapp.replace(/\+/g, '')}?text=${encodedMessage}`,
      '_blank'
    );
  };

  // Fetch the latest YouTube video (no API key)
  useEffect(() => {
    const channelId = 'UCjyoPpvXrF0tpFIm4Axb4DQ';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`)
      .then((res) => res.json())
      .then((data) => {
        const latestVideo = data.items?.[0];
        if (latestVideo) {
          // Prefer extracting from guid (contains full video URL)
          const videoUrl = latestVideo.link || latestVideo.guid || '';
          const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
          const videoId = videoIdMatch ? videoIdMatch[1] : null;

          if (videoId) {
            setLatestVideoId(videoId);
          } else {
            console.warn('Could not extract video ID from:', videoUrl);
          }
        } else {
          console.warn('No videos found in feed.');
        }
      })
      .catch((err) => console.error('Failed to load latest YouTube video:', err));
  }, []);


  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-wood-900/80 via-wood-900/70 to-wood-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {config.business.tagline}
          </h1>
          <p className="text-lg md:text-xl text-cream-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your space with custom-crafted furniture and interiors. 10+ years of excellence in woodwork.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCall}
              className="bg-wood-600 hover:bg-wood-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-4 bg-cream-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-wood-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We bring your vision to life with precision craftsmanship and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '10+ Years Experience',
                description: 'Trusted by hundreds of satisfied customers across Hyderabad',
              },
              {
                title: 'Quality Materials',
                description: 'We use only the finest wood and materials for lasting durability',
              },
              {
                title: 'Custom Designs',
                description: 'Every piece is tailored to your unique style and space',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-wood-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE VIDEO SECTION */}
      <section className="py-16 px-4 bg-wood-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-wood-900 mb-4">See Our Work</h2>
            <p className="text-gray-600 leading-relaxed">Watch how we transform spaces with our craftsmanship</p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
            {latestVideoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${latestVideoId}`}
                title="Latest YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Loading latest video...</div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/gallery"
              className="inline-flex items-center space-x-2 bg-wood-600 hover:bg-wood-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>View Full Gallery</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 bg-gradient-to-br from-wood-800 to-wood-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-cream-200 mb-8 text-lg leading-relaxed">
            Get in touch today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCall}
              className="bg-white hover:bg-cream-100 text-wood-800 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              <span>{config.business.phone}</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
