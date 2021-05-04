import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import { Provider as TransferProvider } from './src/context/TransferContext'

const navigator = createStackNavigator({
  Home: HomeScreen,
});

const App = createAppContainer(navigator);

export default () => {
  return (
    <TransferProvider>
      <App />
    </TransferProvider>
  )
}