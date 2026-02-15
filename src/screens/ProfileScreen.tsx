import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { addPassword } from '../utils/passwordStorage';
import { savePin, deletePin } from '../utils/secureStore';

interface ProfileScreenProps {
  pin: string;
  onPinChanged: () => void;
  navigation?: any;
}

export default function ProfileScreen({ pin, onPinChanged, navigation }: ProfileScreenProps) {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const handleAddPassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Password field is required');
      return;
    }

    try {
      await addPassword({ service, username, password }, pin);
      Alert.alert('Success', 'Password added successfully');
      setService('');
      setUsername('');
      setPassword('');

      // Trigger refresh on main screen
      if (navigation) {
        navigation.navigate('Passwords', { refresh: Date.now() });
      }
    } catch (error) {
      console.error('Error adding password:', error);
      Alert.alert('Error', 'Failed to add password. Please try again.');
    }
  };

  const handleChangePin = async () => {
    if (newPin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    if (newPin !== confirmNewPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    await savePin(newPin);
    Alert.alert('Success', 'PIN changed successfully. Please restart the app.');
    setNewPin('');
    setConfirmNewPin('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Password</Text>

        <TextInput
          style={styles.input}
          value={service}
          onChangeText={setService}
          placeholder="Service (optional)"
          placeholderTextColor="#777"
        />

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username or Email (optional)"
          placeholderTextColor="#777"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password (required)"
          placeholderTextColor="#777"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAddPassword}>
          <Text style={styles.buttonText}>Add Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change App PIN</Text>

        <TextInput
          style={styles.input}
          value={newPin}
          onChangeText={setNewPin}
          placeholder="New PIN"
          placeholderTextColor="#777"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
        />

        <TextInput
          style={styles.input}
          value={confirmNewPin}
          onChangeText={setConfirmNewPin}
          placeholder="Confirm New PIN"
          placeholderTextColor="#777"
          secureTextEntry
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePin}>
          <Text style={styles.buttonText}>Change PIN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124',
    paddingTop: 60,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#292A2D',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#e8eaed',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3c4043',
  },
  button: {
    backgroundColor: '#FCC934',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#202124',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
