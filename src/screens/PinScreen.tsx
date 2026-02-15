import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { savePin, getPin, checkPin } from '../utils/secureStore';

interface PinScreenProps {
  onAuthenticated: (pin: string) => void;
}

export default function PinScreen({ onAuthenticated }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    checkIfPinExists();
  }, []);

  const checkIfPinExists = async () => {
    const existingPin = await getPin();
    setIsSettingPin(!existingPin);
  };

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    if (isSettingPin) {
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      }

      if (pin !== confirmPin) {
        Alert.alert('Error', 'PINs do not match');
        setPin('');
        setConfirmPin('');
        setIsConfirming(false);
        return;
      }

      await savePin(pin);
      Alert.alert('Success', 'PIN set successfully');
      onAuthenticated(pin);
    } else {
      const isValid = await checkPin(pin);
      if (isValid) {
        onAuthenticated(pin);
      } else {
        Alert.alert('Error', 'Incorrect PIN');
        setPin('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSettingPin ? 'Set Your PIN' : 'Enter PIN'}
      </Text>

      <TextInput
        style={styles.input}
        value={isConfirming ? confirmPin : pin}
        onChangeText={isConfirming ? setConfirmPin : setPin}
        placeholder={isConfirming ? 'Confirm PIN' : 'Enter PIN'}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handlePinSubmit}>
        <Text style={styles.buttonText}>
          {isConfirming ? 'Confirm' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202124',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    height: 60,
    backgroundColor: '#292A2D',
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#e8eaed',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3c4043',
  },
  button: {
    width: '80%',
    height: 55,
    backgroundColor: '#FCC934',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#202124',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
