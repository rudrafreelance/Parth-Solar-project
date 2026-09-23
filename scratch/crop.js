const sharp = require('sharp');
const path = require('path');

async function processImage() {
  try {
    const inputPath = path.join(__dirname, '../public/logo.png');
    const outputPath = path.join(__dirname, '../public/logo-cropped.png');
    
    // Trim the white background
    await sharp(inputPath)
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        threshold: 20
      })
      .toFile(outputPath);
    console.log("Successfully cropped the logo");
  } catch (error) {
    console.error("Error processing image:", error);
  }
}

processImage();
