import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColorr='#7d40e7' />
      <Routes />
    </>
  );
}
