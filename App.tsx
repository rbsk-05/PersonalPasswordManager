import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import PinScreen from './src/screens/PinScreen';
import MainScreen from './src/screens/MainScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ pin }: { pin: string }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#292A2D',
          borderTopColor: '#3c4043',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FCC934',
        tabBarInactiveTintColor: '#9aa0a6',
      }}
    >
      <Tab.Screen name="Passwords">
        {(props) => <MainScreen {...props} pin={pin} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} pin={pin} onPinChanged={() => { }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPin, setUserPin] = useState('');

  const handleAuthentication = (pin: string) => {
    setUserPin(pin);
    setIsAuthenticated(true);
  };

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Pin">
              {(props) => <PinScreen {...props} onAuthenticated={handleAuthentication} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main">
              {(props) => <MainTabs {...props} pin={userPin} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
