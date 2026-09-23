const sharp = require('sharp');
const path = require('path');
async function run() {
  const meta = await sharp(path.join(__dirname, '../public/logo-cropped.png')).metadata();
  console.log(meta.width, meta.height);
}
run();
