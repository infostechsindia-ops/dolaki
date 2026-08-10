import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://auramart.in';

  // Static routes
  const staticRoutes = [
    '',
    '/flado',
    '/categories',
    '/brands',
    '/deals',
    '/cart',
    '/checkout',
    '/account',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Product routes fetched from backend API
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const list = json.data || [];
      productRoutes = list.map((product: any) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error('Sitemap product fetch error:', e);
  }

  // Dynamic Category routes
  const categorySlugs = ['electronics', 'fashion', 'beauty', 'groceries', 'home', 'sports'];
  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic Brand routes
  const brandSlugs = ['apple', 'samsung', 'nike', 'sony', 'adidas', 'noise', 'boat'];
  const brandRoutes = brandSlugs.map((slug) => ({
    url: `${baseUrl}/brands/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
