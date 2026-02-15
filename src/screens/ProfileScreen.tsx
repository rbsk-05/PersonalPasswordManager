import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { addPassword } from '../utils/passwordStorage';
import { savePin, deletePin } from '../utils/secureStore';

interface ProfileScreenProps {
  pin: string;
  onPinChanged: () => void;
}

export default function ProfileScreen({ pin, onPinChanged }: ProfileScreenProps) {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const handleAddPassword = async () => {
    if (!service || !username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    await addPassword({ service, username, password }, pin);
    Alert.alert('Success', 'Password added successfully');
    setService('');
    setUsername('');
    setPassword('');
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
          placeholder="Service (e.g., Gmail, Facebook)"
          placeholderTextColor="#777"
        />

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username or Email"
          placeholderTextColor="#777"
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
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
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#eee',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
