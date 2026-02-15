import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORDS_KEY = 'encrypted_passwords';

export interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
}

// Base64 encoding/decoding for React Native
const base64Encode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

const base64Decode = (str: string): string => {
  return decodeURIComponent(escape(atob(str)));
};

// XOR encryption without Buffer
const encryptData = (data: string, key: string): string => {
  const encrypted = Array.from(data)
    .map((char, i) => {
      const keyChar = key.charCodeAt(i % key.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    })
    .join('');
  return base64Encode(encrypted);
};

const decryptData = (encryptedData: string, key: string): string => {
  const encrypted = base64Decode(encryptedData);
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

export const updatePassword = async (id: string, entry: Omit<PasswordEntry, 'id'>, pin: string) => {
  const passwords = await loadPasswords(pin);
  const index = passwords.findIndex(p => p.id === id);
  if (index !== -1) {
    passwords[index] = { ...entry, id };
    await savePasswords(passwords, pin);
  }
};

export const deletePassword = async (id: string, pin: string) => {
  const passwords = await loadPasswords(pin);
  const filtered = passwords.filter(p => p.id !== id);
  await savePasswords(filtered, pin);
};
