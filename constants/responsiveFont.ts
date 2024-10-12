import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const baseWidth = 375;
const baseHeight = 850;

export function responsiveWidth(widParam) {
  return (width / baseWidth) * widParam;
}


export function responsiveHeight(heightParam) {
  return (height / baseHeight) * heightParam;
}




