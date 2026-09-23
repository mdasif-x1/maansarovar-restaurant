import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://maansarovar-restaurant.vercel.app';

export const SEO: React.FC<SEOProps> = ({
  title = 'The Maansarovar Restaurant & Food Court | Lakhimpur Kheri',
  description = 'The Maansarovar Restaurant & Food Court located beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Lakhimpur Kheri, Uttar Pradesh.',
  canonicalPath = '/',
  ogImage = '/images/illustrative-food/illustrative-food-01.jpg',
  noindex = false,
}) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper for meta tag setting
    const setMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [key, val] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(key, val.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // Description
    setMeta('meta[name="description"]', 'content', description);

    // Robots noindex if private route
    if (noindex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    } else {
      setMeta('meta[name="robots"]', 'content', 'index, follow');
    }

    // Canonical link
    const canonicalUrl = `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // OpenGraph
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', 'The Maansarovar Restaurant & Food Court');

    // Twitter
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [title, description, canonicalPath, ogImage, noindex]);

  return null;
};
