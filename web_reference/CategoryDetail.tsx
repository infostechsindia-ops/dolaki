import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { CategoryThemeConfig, sampleCategoryThemeConfig } from './CategoryThemeConfig';
import { CategoryPageRenderer } from './CategoryLayoutRenderer';
import categoryThemes from './data/categoryThemes.json';

// --- Skeleton Loaders ---
const SkeletonHero = () => (
  <div className="w-full h-64 md:h-96 rounded-2xl bg-gray-200 animate-pulse"></div>
);

const SkeletonBrandCarousel = () => (
  <div className="py-4">
    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
    <div className="flex space-x-6 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonProductGrid = () => (
  <div className="pt-4">
    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="min-h-screen bg-gray-50 pb-20">
    <div className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <SkeletonHero />
      <SkeletonBrandCarousel />
      <SkeletonProductGrid />
    </div>
  </div>
);

// Mock API call to simulate fetching SDUI from backend
const fetchCategoryLayout = async (categoryId: string): Promise<CategoryThemeConfig> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find the specific category from our data feed
      const data = categoryThemes.find(c => c.categoryId === categoryId);
      if (data) {
        resolve(data as CategoryThemeConfig);
      } else {
        // Fallback to sample or reject
        resolve(sampleCategoryThemeConfig);
      }
    }, 800);
  });
};



export default function CategoryDetail() {
  const { categoryId = 'electronics' } = useParams<{ categoryId: string }>();
  const [pageData, setPageData] = useState<CategoryThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCategoryLayout(categoryId).then(data => {
      setPageData(data);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (!pageData) return <div>Category not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ backgroundColor: pageData.theme.backgroundColor, fontFamily: pageData.theme.fontFamily }}>
      {/* Category Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900" style={{ color: pageData.theme.primaryColor }}>{pageData.title}</h1>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
              <span>Sort</span> <FiChevronDown />
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition">
              <FiFilter /> <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryPageRenderer config={pageData} />
      </div>
    </div>
  );
}
