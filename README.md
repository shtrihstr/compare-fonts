# Compare Fonts
Defines visual similarity of fonts and calculates CSS properties for better similarity.

# Installation
```
npm i --save compare-fonts
```

# Usage

```js
import compareFonts from 'compare-fonts';

const roboto = '/path/to/roboto.ttf';
const arial = '/path/to/arial.ttf';

const similarity = compareFonts(roboto, arial);

console.log(similarity);
// result: { sizeSimilarity: 0.9480815598101029,
//           visualSimilarity: 0.6155284688939853,
//           adaptation: {
//            fontSize: 0.9612970711297071,
//            letterSpacing: 0.027620390386735496,
//            wordSpacing: -0.075199276867221 }
//         }
```
