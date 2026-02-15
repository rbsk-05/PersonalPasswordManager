import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { loadPasswords, deletePassword, PasswordEntry } from '../utils/passwordStorage';

interface MainScreenProps {
  pin: string;
  navigation: any;
  route?: any;
}

export default function MainScreen({ pin, navigation, route }: MainScreenProps) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  useEffect(() => {
    loadPasswordData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPasswordData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.refresh) {
      loadPasswordData();
    }
  }, [route?.params?.refresh]);

  const loadPasswordData = async () => {
    const data = await loadPasswords(pin);
    setPasswords(data);
  };

  const handleCopyPassword = async (password: string) => {
    await Clipboard.setStringAsync(password);
    Alert.alert('Copied', 'Password copied to clipboard');
  };

  const handleDeletePassword = (id: string) => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePassword(id, pin);
            loadPasswordData();
          },
        },
      ]
    );
  };

  const renderPasswordItem = ({ item }: { item: PasswordEntry }) => (
    <View style={styles.passwordCard}>
      <View style={styles.cardContent}>
        <Text style={styles.serviceName}>{item.service}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopyPassword(item.password)}
        >
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePassword(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Passwords</Text>

      {passwords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No passwords saved yet</Text>
          <Text style={styles.emptySubtext}>Go to Profile to add your first password</Text>
        </View>
      ) : (
        <FlatList
          data={passwords}
          renderItem={renderPasswordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124',
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  passwordCard: {
    backgroundColor: '#292A2D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FCC934',
  },
  cardContent: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#9aa0a6',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  copyButton: {
    backgroundColor: '#FCC934',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#5f6368',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#202124',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#9aa0a6',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#5f6368',
  },
});
