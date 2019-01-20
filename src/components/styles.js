import { StyleSheet } from 'react-native';

const vars = {
  csGrey: '#222222',
  csGreen: '#AF9D83',
  csDanger: '#DC3545',
  csBrown: '#5F5F5F',
  csLight: '#D8D8D8',
  csWhite: '#FFFFFF',
  csBlack: '#000000',
  csBoxBorderWidth: 2,
  csBoxBorderRadius: 8,
  csBoxBorderRadius2x: 16
};

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
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8
  },
});

const base = StyleSheet.create({
  full: {
    flex: 1
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
  }
});

export default {
  vars,
  base,
  component
};
