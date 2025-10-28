import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, index }) {
  return (
    <div
      className={`flex flex-col ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      } gap-8 items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}
    >
      {/* Content Section */}
      <div className="flex-1 p-8 md:p-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-xl mb-6 shadow-md">
          {product.icon}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
          {product.name}
        </h2>
        
        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
          {product.description}
        </p>

        {product.features && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              Key Features
            </h3>
            <ul className="space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">
                    ✓
                  </span>
                  <span className="text-neutral-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.applications && (
          <div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              Suitable For
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.applications.map((app) => (
                <span
                  key={app}
                  className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="flex-1 w-full h-full relative">
        <div className="relative h-80 md:h-[500px] w-full overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}