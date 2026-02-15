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
          backgroundColor: '#16213e',
          borderTopColor: '#0f3460',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#777',
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
