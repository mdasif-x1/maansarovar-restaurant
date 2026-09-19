import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'The Maansarovar Restaurant & Food Court | Lakhimpur Kheri',
  description = 'The Maansarovar Restaurant & Food Court located beside Zila Panchayat Amrit Sarovar, Sitapur–Lakhimpur Road, Lakhimpur Kheri, Uttar Pradesh.',
}) => {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};
