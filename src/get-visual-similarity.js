const config = require('./config');

const getSymbolPosition = (symbol, font1, font2, fontSize1, fontSize2) => {
  const box1 = font1.getPath(symbol, fontSize1).getBoundingBox();
  const box2 = font2.getPath(symbol, fontSize2).getBoundingBox();

  const offsetX = 1 - Math.min(box1.x1, box2.x1);
  const offsetY = 1 - Math.min(box1.y1, box2.y1);

  const width = Math.ceil(Math.max(box1.x2 - box1.x1, box2.x2 - box2.x1)) + 2;
  const height = Math.ceil(Math.max(box1.y2 - box1.y1, box2.y2 - box2.y1)) + 2;

  return {
    offsetX,
    offsetY,
    width,
    height,
  };
};

const getPathMatrix = (path, width, height, cropBox) => {
  const canvas =  document.createElement('canvas'); // todo: add node support
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const localPath = path;
  localPath.fill = 'red';
  localPath.draw(ctx);

  const crop = cropBox || { left: 0, top: 0, width, height };
  return ctx.getImageData(crop.left, crop.top, crop.width, crop.height).data;
};

const getMatrixSimilarity = (matrix1, matrix2) => {
  let hits = 0;
  let total = 0;
  let i;
  let c1;
  let c2;

  for (i = 0; i < matrix1.length; i += 4) {

    c1 = (matrix1[i] * matrix1[i + 3]) / 255;
    c2 = (matrix2[i] * matrix2[i + 3]) / 255;

    if (c1 > 200 && c2 > 200) {
      hits += 1;
    }

    if (c1 > 200 || c2 > 200) {
      total += 1;
    }
  }

  if (total === 0) {
    return 0;
  }

  return hits / total;
};

const getSymbolVisualSimilarity = (symbol, baseFont, comparableFont, comparableFontSize) => {
  const {
    offsetX,
    offsetY,
    width,
    height,
  } = getSymbolPosition(symbol, baseFont, comparableFont, config.fontSize, comparableFontSize);

  const baseFontPath = baseFont.getPathAt(symbol, config.fontSize, offsetX, offsetY);
  const comparableFontPath = comparableFont.getPathAt(symbol, comparableFontSize, offsetX, offsetY);

  const baseFontMatrix = getPathMatrix(baseFontPath, width, height);
  const comparableFontMatrix = getPathMatrix(comparableFontPath, width, height);

  return getMatrixSimilarity(baseFontMatrix, comparableFontMatrix);
};

const getVisualStrokeSimilarity = (baseFont, comparableFont, heightScale) => {
  const comparableFontSize = Math.round(config.fontSize * heightScale);
  const symbol = 'i';
  const cropHeight = 4;

  const {
    offsetX,
    offsetY,
    width,
    height,
  } = getSymbolPosition(symbol, baseFont, comparableFont, config.fontSize, comparableFontSize);

  const baseFontPath = baseFont.getPathAt(symbol, config.fontSize, offsetX, offsetY);
  const comparableFontPath = comparableFont.getPathAt(symbol, comparableFontSize, offsetX, offsetY);

  const cropBox = {
    width,
    left: 0,
    top: Math.ceil((height - cropHeight) / 2),
    height: cropHeight,
  };

  const baseFontMatrix = getPathMatrix(baseFontPath, width, height, cropBox);
  const comparableFontMatrix = getPathMatrix(comparableFontPath, width, height, cropBox);

  return getMatrixSimilarity(baseFontMatrix, comparableFontMatrix);
};

const getVisualSimilarity = (baseFont, comparableFont, heightScale, letterFrequency) => {
  const comparableFontSize = Math.round(config.fontSize * heightScale);
  let avgSimilaritySum = 0;
  let avgSimilarityWeightSum = 0;
  let weight;
  let similarity;

  Object.keys(letterFrequency).forEach((symbol) => {
    similarity = getSymbolVisualSimilarity(symbol, baseFont, comparableFont, comparableFontSize);

    weight = letterFrequency[symbol];

    avgSimilaritySum += similarity * weight;
    avgSimilarityWeightSum += weight;
  });

  const avgSimilarity = avgSimilaritySum / avgSimilarityWeightSum;

  // stroke weight correction (30%)
  const strokeSymbolSimilarity = getVisualStrokeSimilarity(baseFont, comparableFont, heightScale);
  return (avgSimilarity * 0.7) + (strokeSymbolSimilarity * 0.3);
};

module.exports = getVisualSimilarity;
