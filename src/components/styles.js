import { StyleSheet, Platform } from 'react-native';
import { DEVICE_BOTTOM_SAFE,
  DEVICE_TOP_SAFE,
  IS_DEVICE_SHORT_HEIGHT,
  IS_DEVICE_VERY_LONG_WIDTH } from '../deviceHelper'
  
const vars = {
  csBlue: '#0088FF',
  csGrey: '#515151',
  csLightGrey: '#8E8E93',
  csGreen: '#2A593F',
  csDanger: '#DC3545',
  csBrown: '#5F5F5F',
  csLight: '#D8D8D8',
  csWhite: '#FFFFFF',
  csBlack: '#000000',
  csTextGrey: '#515151',
  csPlaceHolder: '#CDC9C6',
  csBoxBorderWidth: 2,
  csBoxBorderRadius: 8,
  csBoxBorderRadius2x: 16,
  csBoxSpacingHalf: IS_DEVICE_VERY_LONG_WIDTH ? 6 : 4,
  csBoxSpacing: IS_DEVICE_VERY_LONG_WIDTH ? 12 : 8,
  csBoxSpacing2x: IS_DEVICE_VERY_LONG_WIDTH ? 24 : 16,
  csInputHeight: IS_DEVICE_SHORT_HEIGHT ? 30 : 44,
  csPickerHeight: 44,
  csPickerBorderRadius: 20,
  csInputBorderRaius: IS_DEVICE_SHORT_HEIGHT ? 15 : 22,
  csInputHorizontalPadding: IS_DEVICE_SHORT_HEIGHT ? 13 : 20,
};

const mixin = {
  csBlackOpacity: (opacity: number) => `rgba(0, 0, 0, ${opacity.toFixed(2)})`,
  csGreyOpacity: (opacity: number) => `rgba(34, 34, 34, ${opacity.toFixed(2)})`
}

const text = StyleSheet.create({
  regular: {
    fontFamily: 'SFProDisplay-Regular'
  },
  medium: {
    fontFamily: 'SFProDisplay-Medium'
  },
  bold: {
    fontFamily: 'SFProDisplay-Bold'
  },
  textPrimary: {
    color: vars.csGreen
  },
  textCenter: {
    textAlign: 'center'
  },
  textWhite: {
    color: vars.csWhite
  },
  textDanger: {
    color: vars.csDanger
  },
  textSecondary: {
    color: vars.csBrown
  },
  textLight: {
    color: vars.csLight
  },
  textMain: {
    color: vars.csTextGrey
  },
})

const component = StyleSheet.create({
  textInputStyle: {
    backgroundColor: "#fff",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    color: "#495057",
    fontSize: 15,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 5
  },
  textInputFocus: {
    borderColor: "#80bdff"
  },
  titleInputStyle: {
    marginLeft: 0,
    ...text.regular,
    color: vars.csTextGrey,
    marginBottom: 8,
    fontSize: 14
  },
});

const base = StyleSheet.create({
  full: {
    flex: 1
  },
  w100: {
    width: '100%'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowCenterLine: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowCenterLineBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row'
  },
  relative: {
    position: 'relative'
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowReverse: {
    flexDirection: 'row-reverse'
  },
  absoluteFull: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  absoluteTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  absoluteBottomLeftRight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  absoluteTopBottomLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0
  },
  absoluteTopBottomRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0
  },
  cardPrimary: {
    backgroundColor: vars.csWhite,
    borderWidth: vars.csBoxBorderWidth,
    borderColor: vars.csGreen,
    borderRadius: vars.csBoxBorderRadius,
    padding: vars.csBoxSpacing,
    marginBottom: vars.csBoxSpacing,
    overflow: 'hidden'
  },
  cardSecondary: {
    backgroundColor: vars.csGrey,
    borderRadius: vars.csBoxBorderRadius,
    padding: vars.csBoxSpacing,
    marginBottom: vars.csBoxSpacing,
    overflow: 'hidden'
  },
  linePrimary: {
    height: 1,
    backgroundColor: vars.csGreen,
    marginTop: 3,
    marginBottom: 2
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { 
          width: 0, 
          height: 2
        },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 3,
      }
    })
  }
});

export default {
  vars,
  mixin,
  base,
  text,
  component
};
