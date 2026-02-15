import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORDS_KEY = 'encrypted_passwords';

export interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
}

// Simple XOR encryption (for demonstration - you could use a more robust method)
const encryptData = (data: string, key: string): string => {
  const keyHash = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const encrypted = Array.from(data)
    .map((char, i) => {
      const keyChar = key.charCodeAt(i % key.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    })
    .join('');
  return Buffer.from(encrypted).toString('base64');
};

const decryptData = (encryptedData: string, key: string): string => {
  const encrypted = Buffer.from(encryptedData, 'base64').toString();
  const decrypted = Array.from(encrypted)
    .map((char, i) => {
      const keyChar = key.charCodeAt(i % key.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    })
    .join('');
  return decrypted;
};

export const savePasswords = async (passwords: PasswordEntry[], pin: string) => {
  const jsonData = JSON.stringify(passwords);
  const encrypted = encryptData(jsonData, pin);
  await AsyncStorage.setItem(PASSWORDS_KEY, encrypted);
};

export const loadPasswords = async (pin: string): Promise<PasswordEntry[]> => {
  try {
    const encrypted = await AsyncStorage.getItem(PASSWORDS_KEY);
    if (!encrypted) return [];

    const decrypted = decryptData(encrypted, pin);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to load passwords:', error);
    return [];
  }
};

export const addPassword = async (entry: Omit<PasswordEntry, 'id'>, pin: string) => {
  const passwords = await loadPasswords(pin);
  const newEntry: PasswordEntry = {
    ...entry,
    id: Date.now().toString(),
  };
  passwords.push(newEntry);
  await savePasswords(passwords, pin);
};

export const deletePassword = async (id: string, pin: string) => {
  const passwords = await loadPasswords(pin);
  const filtered = passwords.filter(p => p.id !== id);
  await savePasswords(filtered, pin);
};
