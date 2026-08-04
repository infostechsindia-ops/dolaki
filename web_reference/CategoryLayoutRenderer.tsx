import React, { useState, useEffect, useRef } from 'react';
import { FiHeart } from 'react-icons/fi';
import { CategoryBlock } from './CategoryThemeConfig';

export const HeroCarousel = ({ block }: { block: CategoryBlock }) => {
  const banners = block.data.banners || [block.data];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    // Only autoPlay if not explicitly disabled
    if (block.layout?.autoPlay === false) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length, block.layout?.autoPlay]);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-gray-900">
      {banners.map((banner: any, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent z-10"></div>
          <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 text-white w-full md:w-2/3">
            {block.sponsorship?.isSponsored && (
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded inline-block w-max mb-4 backdrop-blur-sm">
                Sponsored by {block.sponsorship.sponsorName}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{banner.title}</h2>
            <p className="text-lg md:text-xl font-medium mb-8 text-blue-100">{banner.subtitle}</p>
            <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold w-max shadow-lg hover:bg-gray-100 transition transform group-hover:scale-105">
              {banner.ctaText}
            </button>
          </div>
        </div>
      ))}
      
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {banners.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const BrandCarousel = ({ block }: { block: CategoryBlock }) => (
  <div className="py-4">
    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">{block.data.title}</h3>
    <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
      {block.data.brands?.map((brand: any, i: number) => (
        <div key={i} className="flex flex-col items-center space-y-3 cursor-pointer group flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-800 group-hover:border-blue-500 group-hover:shadow-md transition">
            <img src={brand.logoUrl} alt={brand.name} className="w-12 h-12 object-contain" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{brand.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export const PromotionalFlash = ({ block }: { block: CategoryBlock }) => (
  <div className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: block.data.bgColor || '#dc2626' }}>
    <div className="px-6 py-8 flex flex-col md:flex-row items-center justify-between text-white relative">
      <div className="z-10 text-center md:text-left mb-6 md:mb-0">
        <h3 className="text-2xl font-black uppercase italic">{block.data.title}</h3>
        <p className="text-lg font-medium opacity-90">{block.data.subtitle}</p>
      </div>
      <div className="z-10 flex space-x-4 items-center">
        {block.data.timerEnd && (
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg font-mono font-bold text-xl">
            12 : 45 : 30
          </div>
        )}
        <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-50 transition">
          {block.data.ctaText}
        </button>
      </div>
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-white opacity-10 rounded-full"></div>
    </div>
  </div>
);

export const ProductListingGrid = ({ block }: { block: CategoryBlock }) => (
  <div className="pt-4">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{block.data.title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {block.data.products?.map((product: any) => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
          <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <FiHeart className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer w-5 h-5 z-20" />
              <span>Product Image</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-900 mb-2 truncate">{product.name}</p>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProductCarousel = ({ block }: { block: CategoryBlock }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-play logic
  useEffect(() => {
    // Only autoPlay if enabled in config
    if (block.layout?.autoPlay !== true) return;
    
    let interval: NodeJS.Timeout;
    
    if (!isDragging) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          
          // Determine if we've reached the end (with a small threshold)
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            // Reset to beginning
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by one item width approximately (e.g. min-w-[200px] + gap)
            scrollRef.current.scrollBy({ left: 216, behavior: 'smooth' });
          }
        }
      }, 3000); // 3 seconds interval
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [block.layout?.autoPlay, isDragging]);

  // Desktop Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mobile Touch Events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="pt-4">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{block.data.title}</h3>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseLeaveOrUp}
        onTouchCancel={handleMouseLeaveOrUp}
        onTouchMove={handleTouchMove}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {block.data.products?.map((product: any) => (
          <div key={product.id} className="snap-start bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group min-w-[160px] md:min-w-[200px] flex-shrink-0">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <FiHeart className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer w-5 h-5 z-20" />
                <img 
                  src={product.imageUrl || `https://via.placeholder.com/300x400/f3f4f6/333333?text=${encodeURIComponent(product.name)}`} 
                  alt={product.name} 
                  loading="lazy" 
                  className="w-full h-full object-cover pointer-events-none" 
                />
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-gray-900 mb-2 truncate pointer-events-none">{product.name}</p>
              <div className="flex items-center space-x-2 mb-2 pointer-events-none">
                <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MasonryGrid = ({ block }: { block: CategoryBlock }) => (
  <div className="pt-4">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{block.data.title}</h3>
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {block.data.items?.map((item: any) => (
        <div key={item.id} className="break-inside-avoid relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer">
          <img src={item.imageUrl} alt="Masonry item" className="w-full object-cover rounded-xl transform group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow text-sm flex items-center space-x-2">
              <FiHeart /> <span>Shop Look</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Factory Service for rendering Category Layouts based on config
export const CategoryLayoutRenderer = ({ block }: { block: CategoryBlock }) => {
  // Explicitly handle layouts if defined
  if (block.layout?.type) {
    switch (block.layout.type) {
      case 'masonry':
        return <MasonryGrid key={block.id} block={block} />;
      case 'grid':
        return <ProductListingGrid key={block.id} block={block} />;
      case 'carousel':
        return block.type === 'BRAND_CAROUSEL' 
          ? <BrandCarousel key={block.id} block={block} />
          : <ProductCarousel key={block.id} block={block} />;
    }
  }

  // Fallback block type handling
  switch (block.type) {
    case 'HERO_BANNER':
      return <HeroCarousel key={block.id} block={block} />;
    case 'BRAND_CAROUSEL':
      return <BrandCarousel key={block.id} block={block} />;
    case 'PROMOTIONAL_BANNER':
      return <PromotionalFlash key={block.id} block={block} />;
    case 'PRODUCT_LISTING':
      return <ProductListingGrid key={block.id} block={block} />;
    case 'CONTENT_MASONRY':
      return <MasonryGrid key={block.id} block={block} />;
    default:
      console.warn(`Unsupported block type: ${(block as any).type}`);
      return null;
  }
};

export const CategoryPageRenderer = ({ config }: { config: import('./CategoryThemeConfig').CategoryThemeConfig }) => {
  return (
    <div className="space-y-8">
      {config.blocks.sort((a, b) => a.order - b.order).map((block) => (
        <CategoryLayoutRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
