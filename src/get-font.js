const opentype = require('opentype.js');

const getFont = filename => new Promise((resolve, reject) => {
  opentype.load(filename, (err, font) => {
    if (err) {
      return reject(err);
    }

    const getPath = (text, size) => font.getPath(text, 0, 0, size);

    const getPathAt = (text, size, x, y) => font.getPath(text, x, y, size);

    const getSymbolWidth = (symbol, size) => {
      const glyph = font.charToGlyph(symbol);
      return glyph.advanceWidth / (glyph.path.unitsPerEm * size);
    };

    const getTextWidth = (text, size) => {
      if (text.length === 1) {
        return getSymbolWidth(text, size);
      }
      const box = getPath(text, size).getBoundingBox();
      return box.x2 - box.x1;
    };

    return resolve({
      getPath,
      getPathAt,
      getTextWidth,
    });
  });
});

module.exports = getFont;
