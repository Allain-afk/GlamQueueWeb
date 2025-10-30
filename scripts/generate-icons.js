// Simple icon generation script
// This creates basic placeholder icons
// For production, replace these with actual icons generated from your logo

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple SVG-based icon (will be converted to PNG)
// For now, we'll create SVG files that browsers can use
sizes.forEach(size => {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#e91e8c" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">GQ</text>
</svg>`;
  
  // Create SVG file (browsers can use SVG in manifest)
  fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.svg`), svgContent);
  
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('\n✅ Icon files created!');
console.log('\n📝 Note: For production, convert these SVG files to PNG format using:');
console.log('   - Online tool: https://realfavicongenerator.net/');
console.log('   - Or use ImageMagick: convert icon-192x192.svg icon-192x192.png');
console.log('\nThe PWA will work with SVG icons, but PNG is recommended for better compatibility.');

