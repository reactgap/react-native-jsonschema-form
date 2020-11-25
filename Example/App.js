/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';

import FormBasic from './src/FormBasic';
import PickerOption from './src/PickerOption';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <FormBasic />
        {/* <PickerOption /> */}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({});

export default App;
