const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const images = [
  { name: 'hero-restaurant.jpg', title: 'The Maansarovar Restaurant & Food Court', subtitle: 'Lakeside Dining • Sitapur-Lakhimpur Road', bg1: '#1E3A2B', bg2: '#12100E', accent: '#E08D3C' },
  { name: 'lakeside-ambience.jpg', title: 'Amrit Sarovar Lakeside View', subtitle: 'Peaceful Evening Atmosphere', bg1: '#1A2F25', bg2: '#2C4A3A', accent: '#F4A658' },
  { name: 'dining-area.jpg', title: 'Warm Family Dining Interior', subtitle: 'Spacious & Air-Conditioned Comfort', bg1: '#262320', bg2: '#1C1917', accent: '#C85A32' },
  { name: 'food-01.jpg', title: 'Paneer Tikka Angara', subtitle: 'Charcoal Smoked Starters', bg1: '#3D2018', bg2: '#1C1917', accent: '#E08D3C' },
  { name: 'food-02.jpg', title: 'Crispy Veg Salt & Pepper', subtitle: 'Food Court Special', bg1: '#1E3A2B', bg2: '#284635', accent: '#F4A658' },
  { name: 'food-03.jpg', title: 'Dahi Ke Sholay', subtitle: 'Golden Crispy Curd Pockets', bg1: '#2C2016', bg2: '#12100E', accent: '#C85A32' },
  { name: 'food-04.jpg', title: 'Dal Maansarovar Special', subtitle: 'Slow-cooked Charcoal Black Dal', bg1: '#241B15', bg2: '#3D281C', accent: '#E08D3C' },
  { name: 'food-05.jpg', title: 'Paneer Butter Masala', subtitle: 'Rich Creamy Gravy', bg1: '#3B1A12', bg2: '#26120C', accent: '#F4A658' },
  { name: 'food-06.jpg', title: 'Subz Handi Dum Biryani', subtitle: 'Fragrant Saffron Basmati Rice', bg1: '#212A1F', bg2: '#121A11', accent: '#C85A32' },
  { name: 'gallery-01.jpg', title: 'Celebration & Party Space', subtitle: 'Family Gatherings', bg1: '#1E3A2B', bg2: '#12100E', accent: '#E08D3C' },
  { name: 'gallery-02.jpg', title: 'Evening Illumination', subtitle: 'Warm Lighting Decor', bg1: '#262320', bg2: '#362E28', accent: '#F4A658' },
  { name: 'gallery-03.jpg', title: 'Fresh Tandoori Breads', subtitle: 'Artisanal Hearth Baking', bg1: '#331F14', bg2: '#1A0E08', accent: '#C85A32' },
  { name: 'gallery-04.jpg', title: 'Food Court Stalls', subtitle: 'Varied Quick Bite Options', bg1: '#1A2C21', bg2: '#2B4233', accent: '#E08D3C' },
  { name: 'gallery-05.jpg', title: 'Sunset Over Amrit Sarovar', subtitle: 'Scenery Beside Restaurant', bg1: '#2D1F2D', bg2: '#150E18', accent: '#F4A658' },
  { name: 'gallery-06.jpg', title: 'Signature Beverages', subtitle: 'Kulhad Chai & Mocktails', bg1: '#29211C', bg2: '#17120E', accent: '#C85A32' },
  { name: 'gallery-07.jpg', title: 'Comfortable Seating', subtitle: 'Designed for Large Families', bg1: '#1D3025', bg2: '#111D16', accent: '#E08D3C' },
  { name: 'gallery-08.jpg', title: 'Traditional Indian Desserts', subtitle: 'Shahi Saffron Gulab Jamun', bg1: '#361D16', bg2: '#21100C', accent: '#F4A658' }
];

function createSVG(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad_${item.name.replace(/[^a-z0-9]/gi, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${item.bg1}" />
        <stop offset="100%" stop-color="${item.bg2}" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${item.accent}" stroke-width="0.5" opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(#grad_${item.name.replace(/[^a-z0-9]/gi, '')})" />
    <rect width="800" height="600" fill="url(#grid)" />
    <circle cx="400" cy="240" r="160" stroke="${item.accent}" stroke-width="1.5" fill="none" opacity="0.25"/>
    <circle cx="400" cy="240" r="120" stroke="${item.accent}" stroke-width="1" fill="none" opacity="0.15"/>
    <text x="400" y="270" font-family="'Cormorant Garamond', 'Georgia', serif" font-size="32" font-weight="600" fill="#FDFBF7" text-anchor="middle">${item.title}</text>
    <text x="400" y="320" font-family="'Inter', sans-serif" font-size="15" letter-spacing="2" fill="${item.accent}" text-anchor="middle" text-transform="uppercase">${item.subtitle}</text>
    <rect x="250" y="360" width="300" height="1" fill="${item.accent}" opacity="0.4"/>
    <text x="400" y="400" font-family="'Inter', sans-serif" font-size="12" fill="#DFD4B7" text-anchor="middle" opacity="0.7">Photo Placeholder (/public/images/${item.name})</text>
  </svg>`;
}

images.forEach(img => {
  const svgContent = createSVG(img);
  fs.writeFileSync(path.join(imgDir, img.name), svgContent, 'utf8');
});

console.log('Successfully generated image placeholders in public/images/');
