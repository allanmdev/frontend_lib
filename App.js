import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { LoginScreen } from './src/screens/LoginScreen';

import HomeScreen from './src/screens/HomeScreen';
import BookScreen from './src/screens/BookScreen';
import RentScreen from './src/screens/RentScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ListUsersScreen from './src/screens/ListUsersScreen';
import ReturnScreen from './src/screens/ReturnScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Book" component={BookScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Rent" component={RentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListUsers" component={ListUsersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Return" component={ReturnScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}