import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';

export const savePin = async (pin: string) => {
  await SecureStore.setItemAsync(PIN_KEY, pin);
};

export const getPin = async () => {
  return await SecureStore.getItemAsync(PIN_KEY);
};

export const checkPin = async (inputPin: string) => {
  const storedPin = await getPin();
  return storedPin === inputPin;
};

export const deletePin = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
}
