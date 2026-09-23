const sharp = require('sharp');
const path = require('path');

async function processFavicon() {
  try {
    const inputPath = path.join(__dirname, '../public/logo-cropped.png');
    const outputPath = path.join(__dirname, '../public/favicon.png');
    
    // Extract a 373x373 square from the left side of the image
    // The width is 1090, height is 373. 
    await sharp(inputPath)
      .extract({ left: 0, top: 0, width: 373, height: 373 })
      // Make it slightly smaller if we want, or just resize it down to 64x64
      .resize(64, 64)
      .toFile(outputPath);
    console.log("Successfully created favicon.png");
  } catch (error) {
    console.error("Error processing favicon:", error);
  }
}

processFavicon();
