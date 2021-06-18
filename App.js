import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './containers/Search';
import MovieDetail from './containers/MovieDetail';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Movie Search" component={Search} />
        <Stack.Screen name="Movie Detail" component={MovieDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
