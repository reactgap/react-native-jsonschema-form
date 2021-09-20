import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
    marginVertical: 1,
    width: '100%',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    flex: 1,
    paddingBottom: 30,
  },
  bodyContent: {
    borderBottomColor: 'black',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  toucheableLineContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 13,
    paddingBottom: 7,
    color: '#8E8E93',
    fontWeight: '400',
  },
  error: {
    marginBottom: 5,
    color: '#DC3545',
    fontSize: 12,
    marginTop: 2,
    flex: 1,
    fontWeight: '500'
  },
});
