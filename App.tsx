import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NativeTextInput from './NativeTextInput';

function App() {
  const [password, setPassword] = useState('');
  const textInputRef = useRef<TextInput>(null);

  const generatePassword = () => {
    setPassword('abc');
  };

  const focusInput = () => {
    textInputRef.current?.focus();
  };

  const clearInput = () => {
    textInputRef.current?.clear();
    setPassword('');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={generatePassword}>
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={focusInput}>
            <Text style={styles.buttonText}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={clearInput}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <NativeTextInput
          ref={textInputRef}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry={false}
        />

        <Text style={styles.passwordDisplay}>Password: {password}</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 20,
    fontSize: 16,
  },
  passwordDisplay: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default App;
