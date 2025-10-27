import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NativeTextInput from './NativeTextInput';

function App() {
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    setPassword('abc');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={generatePassword}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>

        <NativeTextInput
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
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
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
