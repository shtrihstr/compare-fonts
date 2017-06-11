const config = require('./config');

const getPathHeight = (path) => {
  const box = path.getBoundingBox();
  return box.x2 - box.x1;
};

const getHeightScale = (baseFont, comparableFont) => {
  const symbol = '0';

  const baseFontHeight = getPathHeight(baseFont.getPath(symbol, config.fontSize));
  const comparableFontHeight = getPathHeight(comparableFont.getPath(symbol, config.fontSize));
  return baseFontHeight / comparableFontHeight;
};

module.exports = getHeightScale;
