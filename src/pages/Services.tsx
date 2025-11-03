import ServiceCard from '../components/ServiceCard';
import { Sofa, ChefHat, DoorOpen, Tv, Church, Briefcase, Wrench, PaintBucket } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Custom Furniture',
      icon: <Sofa className="w-12 h-12" />,
      description: 'Bespoke furniture designed and crafted to perfectly match your style and space requirements.',
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Modular Kitchen',
      icon: <ChefHat className="w-12 h-12" />,
      description: 'Modern, functional kitchens with smart storage solutions and premium finishes.',
      images: [
        'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Wardrobes',
      icon: <DoorOpen className="w-12 h-12" />,
      description: 'Spacious wardrobes with custom compartments designed for maximum storage efficiency.',
      images: [
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'TV Units',
      icon: <Tv className="w-12 h-12" />,
      description: 'Elegant entertainment units that blend style with functionality for your living space.',
      images: [
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Pooja Units',
      icon: <Church className="w-12 h-12" />,
      description: 'Sacred spaces crafted with reverence, featuring intricate designs and quality finishes.',
      images: [
        'https://images.pexels.com/photos/8111849/pexels-photo-8111849.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Office Interiors',
      icon: <Briefcase className="w-12 h-12" />,
      description: 'Professional workspace solutions designed for productivity and aesthetic appeal.',
      images: [
        'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Wooden Repairs',
      icon: <Wrench className="w-12 h-12" />,
      description: 'Expert restoration and repair services to bring your wooden furniture back to life.',
      images: [
        'https://images.pexels.com/photos/5974401/pexels-photo-5974401.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/5691621/pexels-photo-5691621.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6419120/pexels-photo-6419120.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      title: 'Polish & Finishing',
      icon: <PaintBucket className="w-12 h-12" />,
      description: 'Premium finishing services including polishing, painting, and protective coatings.',
      images: [
        'https://images.pexels.com/photos/5691621/pexels-photo-5691621.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6315797/pexels-photo-6315797.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4792484/pexels-photo-4792484.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-wood-900 mb-4">Our Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From custom furniture to complete interior solutions, we offer comprehensive woodwork services
              tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard
                key={idx}
                title={service.title}
                icon={service.icon}
                description={service.description}
                images={service.images}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-wood-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-cream-200 mb-8 text-lg leading-relaxed">
            Don't see what you're looking for? We specialize in custom projects. Contact us to discuss your unique requirements.
          </p>
          <a
            href="/contact"
            className="inline-block bg-wood-600 hover:bg-wood-700 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
