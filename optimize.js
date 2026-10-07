/* eslint-disable */
import sharp from 'sharp';
import fs from 'fs';

const directory = './public'; // Ensure this path matches your folder

fs.readdirSync(directory).forEach(file => {
  // Only process standard JPEGs and PNGs
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const baseName = file.substring(0, file.lastIndexOf('.'));
    const inputPath = `${directory}/${file}`;

    // Generate WebP
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(`${directory}/${baseName}.webp`)
      .then(() => console.log(`✅ Created ${baseName}.webp`))
      .catch(err => console.error(err));

    // Generate AVIF
    sharp(inputPath)
      .avif({ quality: 60 })
      .toFile(`${directory}/${baseName}.avif`)
      .then(() => console.log(`✅ Created ${baseName}.avif`))
      .catch(err => console.error(err));
  }
});