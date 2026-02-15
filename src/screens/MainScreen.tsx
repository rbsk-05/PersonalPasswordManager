import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { loadPasswords, deletePassword, updatePassword, PasswordEntry } from '../utils/passwordStorage';

interface MainScreenProps {
  pin: string;
  navigation: any;
  route?: any;
}

export default function MainScreen({ pin, navigation, route }: MainScreenProps) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [editService, setEditService] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPasswordValue, setEditPasswordValue] = useState('');

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

  const handleEditPassword = (item: PasswordEntry) => {
    setEditingPassword(item);
    setEditService(item.service);
    setEditUsername(item.username);
    setEditPasswordValue(item.password);
  };

  const handleSaveEdit = async () => {
    if (!editPasswordValue) {
      Alert.alert('Error', 'Password field is required');
      return;
    }

    if (editingPassword) {
      await updatePassword(
        editingPassword.id,
        { service: editService, username: editUsername, password: editPasswordValue },
        pin
      );
      setEditingPassword(null);
      loadPasswordData();
      Alert.alert('Success', 'Password updated successfully');
    }
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
            Alert.alert('Success', 'Password deleted successfully');
          },
        },
      ]
    );
  };

  const renderPasswordItem = ({ item }: { item: PasswordEntry }) => (
    <View style={styles.passwordCard}>
      <View style={styles.cardRow}>
        <View style={styles.cardContent}>
          {item.service && <Text style={styles.serviceName}>{item.service}</Text>}
          {item.username && <Text style={styles.username}>{item.username}</Text>}
          <Text style={styles.passwordText}>{item.password}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopyPassword(item.password)}
          >
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditPassword(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePassword(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
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

      <Modal
        visible={editingPassword !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingPassword(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Password</Text>

            <TextInput
              style={styles.modalInput}
              value={editService}
              onChangeText={setEditService}
              placeholder="Service"
              placeholderTextColor="#9aa0a6"
            />

            <TextInput
              style={styles.modalInput}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Username"
              placeholderTextColor="#9aa0a6"
            />

            <TextInput
              style={styles.modalInput}
              value={editPasswordValue}
              onChangeText={setEditPasswordValue}
              placeholder="Password"
              placeholderTextColor="#9aa0a6"
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditingPassword(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#9aa0a6',
    marginBottom: 4,
  },
  passwordText: {
    fontSize: 14,
    color: '#FCC934',
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-end',
  },
  copyButton: {
    backgroundColor: '#3c4043',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#5f6368',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#5f6368',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#e8eaed',
    fontWeight: 'bold',
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#292A2D',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e8eaed',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#202124',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#e8eaed',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3c4043',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#5f6368',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#FCC934',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#e8eaed',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
