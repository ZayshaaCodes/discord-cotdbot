const PNG = require('pngjs').PNG;

function generateWhitePNG(width, height) {
  const png = new PNG({ width: width, height: height });

  // set all pixels to white
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = 255;   // red
      png.data[idx + 1] = 255; // green
      png.data[idx + 2] = 255; // blue
      png.data[idx + 3] = 255; // alpha
    }
  }

  // encode the PNG image to a buffer and return it
  return PNG.sync.write(png);
}

module.exports = { generateWhitePNG };
