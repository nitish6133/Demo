import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, Video, Share2, Download, Calendar, User, GraduationCap, Briefcase, CheckCircle, X } from 'lucide-react';
import Footer from '../components/Footer';
import { getAllSessions } from '../services/sessionService';
import { useBrandingStore } from '../stores/useBrandingStore';
import { serviceBaseUrl } from '../constants/appConstants';

interface GeneratedItem {
  id: string;
  studentName: string;
  studentClass: string;
  profession: string;
  futureImageUrl: string;
  finalVideoUrl?: string;
  createdAt: Date;
  isPosted: boolean;
}

const GeneratedContent: React.FC = () => {
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'posted' | 'unposted'>('all');

  useEffect(() => {
    const loadGeneratedContent = async () => {
      setIsLoading(true);

      const branding = useBrandingStore.getState().settings;
      if (!branding?.id) {
        console.error('School ID not found');
        setIsLoading(false);
        return;
      }

      const response = await getAllSessions(branding.id);

      if (response.code === 200 && response.result) {
        const sessions = response.result;
        const mappedItems: GeneratedItem[] = sessions
          .filter(session => session.status === 'ready' || session.status === 'published')
          .map(session => ({
            id: session.id,
            studentName: session.studentName,
            studentClass: session.studentClass,
            profession: session.profession,
            futureImageUrl: session.futureImageId
              ? `${serviceBaseUrl}/images/${session.futureImageId}`
              : `${serviceBaseUrl}/images/${session.studentImageId}`,
            finalVideoUrl: session.videoId ? `${serviceBaseUrl}/videos/${session.videoId}` : undefined,
            createdAt: new Date(session.createdAt),
            isPosted: session.status === 'published',
          }));

        setItems(mappedItems);
      } else {
        console.error('Failed to load sessions:', response.message);
      }

      setIsLoading(false);
    };

    loadGeneratedContent();
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === 'posted') return item.isPosted;
    if (filter === 'unposted') return !item.isPosted;
    return true;
  });

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handlePost = async () => {
    if (selectedItems.size === 0) return;

    setIsPosting(true);

    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update posted status
    setItems(prevItems =>
      prevItems.map(item =>
        selectedItems.has(item.id) ? { ...item, isPosted: true } : item
      )
    );

    setSelectedItems(new Set());
    setIsPosting(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generated content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/teacher"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition duration-200 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Generated Content</h1>
                <p className="text-sm text-gray-600">Manage and share student future images</p>
              </div>
            </div>

            {/* Post Selected Button */}
            {selectedItems.size > 0 && (
              <button
                onClick={handlePost}
                disabled={isPosting}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition duration-200"
              >
                {isPosting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Post Selected ({selectedItems.size})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                    filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setFilter('unposted')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                    filter === 'unposted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unposted ({items.filter(item => !item.isPosted).length})
                </button>
                <button
                  onClick={() => setFilter('posted')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                    filter === 'posted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Posted ({items.filter(item => item.isPosted).length})
                </button>
              </div>
            </div>

            {filteredItems.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition duration-200"
              >
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No generated content available yet.'
                : `No ${filter} content found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                  selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                }`}
              >
                {/* Selection Checkbox */}
                <div className="relative">
                  <img
                    src={item.futureImageUrl}
                    alt={`Future ${item.profession}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4zYIcFuWWsfSvBJdujgD_4dq6Sg6cPUHi3tVx3C9Vp1inuOLdpurfXeY&s';  //only apple
                    }}
                  />
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition duration-200 ${
                      selectedItems.has(item.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {selectedItems.has(item.id) && <CheckCircle className="w-4 h-4" />}
                  </button>

                  {/* Posted Badge */}
                  {item.isPosted && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Posted
                    </div>
                  )}

                  {/* Media Type Indicators */}
                  <div className="absolute bottom-2 left-2 flex space-x-1">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
                      <Image className="w-4 h-4 text-white" />
                    </div>
                    {item.finalVideoUrl && (
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-500 mr-1" />
                    <h3 className="font-semibold text-gray-900">{item.studentName}</h3>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    <span>{item.studentClass}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Briefcase className="w-3 h-3 mr-1" />
                    <span>Future {item.profession}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 text-sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  {!item.isPosted && (
                    <button
                      onClick={() => {
                        setSelectedItems(new Set([item.id]));
                        handlePost();
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Post
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GeneratedContent;