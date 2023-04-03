import { helper } from '@ember/component/helper';
import * as chromaticScale from 'd3-scale-chromatic';
import { interpolateRgb } from 'd3-interpolate';

const brightBlue = '#2ECDFF';
const brightGreen = '#2CCD62';
export default helper(function colorInterpolator([interpolator] /*, named*/) {
  if (interpolator) {
    return chromaticScale[interpolator];
  }
  // Default color scheme is darkmode-aware
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 0, 1
    // return interpolateRgb(brightGreen, '#FEBB2D'); // Dark
    return interpolateRgb('#1e293b', brightBlue); // Dark
  } else {
    // return interpolateRgb(brightGreen, '#FDD173'); // Light
    return interpolateRgb('#f3f4f6', brightBlue); // Light
  }
});
