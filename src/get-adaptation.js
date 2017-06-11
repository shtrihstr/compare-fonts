const shuffle = require('shuffle-array');

const config = require('./config');

const getLetterSpacing = (baseFont, comparableFont, comparableFontSize, letterFrequency) => {
  const symbols = [];

  Object.keys(letterFrequency).forEach((symbol) => {
    for (let i = 0; i < Math.ceil(letterFrequency[symbol] * 10); i += 1) {
      symbols.push(symbol);
    }
  });

  shuffle(symbols);
  const text = symbols.join('');

  const baseFontWidth = baseFont.getTextWidth(text, config.fontSize);
  const comparableFontWidth = comparableFont.getTextWidth(text, comparableFontSize);

  const spaces = text.length - 1;

  return (baseFontWidth - comparableFontWidth) / spaces / comparableFontSize;
};

const getWordSpacing = (baseFont, comparableFont, comparableFontSize, letterSpacing) => {
  const textNoSpace = 'oo';
  const textWithSpace = 'o o';

  const baseFontWidthNoSpace = baseFont.getTextWidth(textNoSpace, config.fontSize);
  const comparableFontWidthNoSpace = comparableFont.getTextWidth(textNoSpace, comparableFontSize);

  const baseFontWidthWithSpace = baseFont.getTextWidth(textWithSpace, config.fontSize);
  const comparableFontWidthWithSpace = comparableFont.getTextWidth(textWithSpace, comparableFontSize);

  const baseFontDiff = baseFontWidthWithSpace - baseFontWidthNoSpace;
  const comparableFontDiff = comparableFontWidthWithSpace - comparableFontWidthNoSpace;

  return ((baseFontDiff - comparableFontDiff) / comparableFontSize) - (letterSpacing * 2);
};


const getAdaptation = (baseFont, comparableFont, heightScale, letterFrequency) => {
  const comparableFontSize = Math.round(config.fontSize * heightScale);

  const letterSpacing = getLetterSpacing(baseFont, comparableFont, comparableFontSize, letterFrequency);
  const wordSpacing = getWordSpacing(baseFont, comparableFont, comparableFontSize, letterSpacing);

  return {
    letterSpacing,
    wordSpacing,
    fontSize: heightScale,
  };
};

module.exports = getAdaptation;
