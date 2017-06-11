const config = require('./config');

const getSizeSimilarity = (baseFont, comparableFont, heightScale, letterFrequency) => {
  const comparableFontSize = Math.round(config.fontSize * heightScale);
  let avgSimilaritySum = 0;
  let avgSimilarityWeightSum = 0;
  let baseFontWidth;
  let comparableFontWidth;
  let weight;
  let similarity;

  Object.keys(letterFrequency).forEach((symbol) => {
    baseFontWidth = baseFont.getTextWidth(symbol, config.fontSize);
    comparableFontWidth = comparableFont.getTextWidth(symbol, comparableFontSize);

    if (baseFontWidth > comparableFontWidth) {
      similarity = comparableFontWidth / baseFontWidth;
    } else {
      similarity = baseFontWidth / comparableFontWidth;
    }

    weight = letterFrequency[symbol];

    avgSimilaritySum += similarity * weight;
    avgSimilarityWeightSum += weight;
  });

  return avgSimilaritySum / avgSimilarityWeightSum;
};

module.exports = getSizeSimilarity;
