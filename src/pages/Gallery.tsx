import { useEffect, useState } from 'react';
import { Youtube, Instagram } from 'lucide-react';
import { config } from '../config';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [videos, setVideos] = useState<{ id: string; title: string; thumbnail: string }[]>([]);

  useEffect(() => {
    if (activeTab === 'photos') {
      // Re-inject Instagram widget
      const oldScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (oldScript) oldScript.remove();
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [activeTab]);

  // ✅ Load YouTube videos without API key
  useEffect(() => {
    if (activeTab === 'videos') {
      const channelId = 'UCjyoPpvXrF0tpFIm4Axb4DQ';
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

      fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.items) return;

          // Extract videoId safely
          const latestVideos = data.items.slice(0, 6).map((item: any) => {
            const videoId = item.link.split('v=')[1] || item.link.split('/').pop();
            return {
              id: videoId,
              title: item.title,
              thumbnail: item.thumbnail,
            };
          });

          setVideos(latestVideos);
        })
        .catch((err) => console.error('Failed to load YouTube feed:', err));
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-wood-900 mb-4">Our Gallery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore our portfolio of completed projects and get inspired for your next woodwork project.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-wood-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'photos'
                    ? 'bg-wood-600 text-white shadow-lg'
                    : 'text-wood-800 hover:bg-wood-200'
                  }`}
              >
                <Instagram className="w-5 h-5" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'videos'
                    ? 'bg-wood-600 text-white shadow-lg'
                    : 'text-wood-800 hover:bg-wood-200'
                  }`}
              >
                <Youtube className="w-5 h-5" />
                <span>Videos</span>
              </button>
            </div>
          </div>

          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-wood-900 mb-2 flex items-center justify-center space-x-2">
                  <Instagram className="w-6 h-6" />
                  <span>Instagram Feed</span>
                </h2>
                <p className="text-gray-600">
                  Follow us on Instagram for daily updates and inspiration
                </p>
              </div>

              <div
                className="min-h-[600px] flex items-center justify-center border-2 border-dashed border-wood-300 rounded-lg bg-wood-50 p-8"
                dangerouslySetInnerHTML={{ __html: config.social.instagramWidgetScript }}
              />
            </div>
          )}

          {/* YouTube Videos */}
          {activeTab === 'videos' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-wood-900 mb-2 flex items-center justify-center space-x-2">
                  <Youtube className="w-6 h-6" />
                  <span>YouTube Videos</span>
                </h2>
                <p className="text-gray-600">
                  Watch our latest projects and woodworking techniques
                </p>
              </div>

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="rounded-xl overflow-hidden shadow-lg bg-gray-900 hover:scale-105 transition-transform"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allowFullScreen
                        className="w-full aspect-video"
                      />
                      <div className="p-3 bg-white text-wood-900 font-medium text-sm truncate">
                        {video.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">Loading latest videos...</p>
              )}

              <div className="mt-6 text-center">
                <a
                  href={config.social.youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
                >
                  <Youtube className="w-5 h-5" />
                  <span>Visit Our YouTube Channel</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-wood-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Like What You See?</h2>
          <p className="text-cream-200 mb-8 text-lg leading-relaxed">
            Let's bring your vision to life with our expert craftsmanship
          </p>
          <a
            href="/contact"
            className="inline-block bg-wood-600 hover:bg-wood-700 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl"
          >
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  );
}
