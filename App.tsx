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
import LegacyNativeTextInput from './specs/LegacyRCTViewManager/NativeTextInput';
import FabricNativeTextInput from './specs/JSINewArchitecture/NativeTextInput';

/**
 * Extended TextInput handle interface
 */
interface ExtendedTextInputHandle {
  focus: () => void;
  clear: () => void;
  isFocused: () => boolean;
  isNativeComponentAvailable: () => boolean;
}

/**
 * Demo App comparing Legacy Bridge vs Fabric (New Architecture) implementations
 *
 * ARCHITECTURE OVERVIEW:
 *
 * Legacy (Bridge):
 * - Uses RCTViewManager on iOS/Android
 * - Communication: JS Thread -> Bridge -> Native Thread
 * - JSON serialization for all data passing
 * - Asynchronous by default, can cause delays
 *
 * Fabric (New Architecture):
 * - Uses JSI (JavaScript Interface) for direct native calls
 * - Communication: JS Thread -> JSI -> Native Thread (direct)
 * - No serialization overhead, direct memory access
 * - Synchronous when needed, better performance
 *
 * FALLBACK STRATEGY:
 * - Child components signal native availability via callback
 * - Parent controls rendering: Native or JS fallback
 * - Single source of truth for component selection
 */
function App() {
  const [legacyText, setLegacyText] = useState('');
  const [fabricText, setFabricText] = useState('');
  const [isLegacyNativeAvailable, setIsLegacyNativeAvailable] = useState(true);
  const [isFabricNativeAvailable, setIsFabricNativeAvailable] = useState(true);
  const legacyInputRef = useRef<ExtendedTextInputHandle>(null);
  const fabricInputRef = useRef<ExtendedTextInputHandle>(null);
  const legacyFallbackRef = useRef<TextInput>(null);
  const fabricFallbackRef = useRef<TextInput>(null);

  /**
   * Auto-focus: When user clears one input, automatically focus the other
   * This creates smooth UX - user can quickly switch between inputs
   */
  const handleLegacyChange = (text: string) => {
    setLegacyText(text);
    // If Legacy input is cleared, auto-focus Fabric input
    if (text === '' && fabricText !== '') {
      if (isFabricNativeAvailable) {
        fabricInputRef.current?.focus();
      } else {
        fabricFallbackRef.current?.focus();
      }
    }
  };

  const handleFabricChange = (text: string) => {
    setFabricText(text);
    // If Fabric input is cleared, auto-focus Legacy input
    if (text === '' && legacyText !== '') {
      if (isLegacyNativeAvailable) {
        legacyInputRef.current?.focus();
      } else {
        legacyFallbackRef.current?.focus();
      }
    }
  };

  // Generate sample text for both inputs
  const generateText = () => {
    const sampleText = 'Hello Native Components!';
    setLegacyText(sampleText);
    setFabricText(sampleText);
  };

  // Clear both text inputs and focus on Legacy
  const clearInputs = () => {
    // Clear text state first
    setLegacyText('');
    setFabricText('');

    // Use setNativeProps to clear native inputs
    if (isLegacyNativeAvailable && legacyInputRef.current) {
      try {
        legacyInputRef.current.clear();
      } catch (e) {
        console.warn('Legacy clear failed:', e);
      }
    } else if (legacyFallbackRef.current) {
      legacyFallbackRef.current.clear();
    }

    if (isFabricNativeAvailable && fabricInputRef.current) {
      try {
        fabricInputRef.current.clear();
      } catch (e) {
        console.warn('Fabric clear failed:', e);
      }
    } else if (fabricFallbackRef.current) {
      fabricFallbackRef.current.clear();
    }

    // Auto-focus Legacy input after clearing
    setTimeout(() => {
      if (isLegacyNativeAvailable) {
        legacyInputRef.current?.focus();
      } else {
        legacyFallbackRef.current?.focus();
      }
    }, 100);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Legacy Bridge vs Fabric JSI</Text>
        <Text style={styles.subtitle}>
          Comparing React Native Architectures
        </Text>

        {/* Control buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={generateText}>
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={clearInputs}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Legacy Architecture Component - Uses RCTViewManager */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legacy Architecture</Text>
          <Text style={styles.description}>
            {isLegacyNativeAvailable
              ? 'Bridge-based communication with JSON serialization'
              : 'Fallback: Using JavaScript TextInput (Native unavailable)'}
          </Text>
          {isLegacyNativeAvailable ? (
            <LegacyNativeTextInput
              ref={legacyInputRef}
              style={styles.input}
              value={legacyText}
              onChangeText={handleLegacyChange}
              onNativeStatusChange={setIsLegacyNativeAvailable}
              placeholder="Bridge: JS → JSON → Native"
            />
          ) : (
            <TextInput
              ref={legacyFallbackRef as any}
              style={[styles.input, styles.fallbackInput]}
              value={legacyText}
              onChangeText={handleLegacyChange}
              placeholder="Fallback: Pure JavaScript"
            />
          )}
          <Text style={styles.displayText}>Output: {legacyText}</Text>
          <Text style={styles.statusText}>
            Status: {isLegacyNativeAvailable ? 'Native ✓' : 'Fallback JS'}
          </Text>
        </View>

        {/* Fabric Architecture Component - Uses JSI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fabric Architecture</Text>
          <Text style={styles.description}>
            {isFabricNativeAvailable
              ? 'JSI direct communication with zero serialization'
              : 'Fallback: Using JavaScript TextInput (Fabric unavailable)'}
          </Text>
          {isFabricNativeAvailable ? (
            <FabricNativeTextInput
              ref={fabricInputRef}
              style={styles.fabricInput}
              value={fabricText}
              onChangeText={handleFabricChange}
              onNativeStatusChange={setIsFabricNativeAvailable}
              placeholder="JSI: JS → Direct → Native"
            />
          ) : (
            <TextInput
              ref={fabricFallbackRef as any}
              style={styles.fallbackInput}
              value={fabricText}
              onChangeText={handleFabricChange}
              placeholder="Fallback: Pure JavaScript"
            />
          )}
          <Text style={styles.displayText}>Output: {fabricText}</Text>
          <Text style={styles.statusText}>
            Status: {isFabricNativeAvailable ? 'Native ✓' : 'Fallback JS'}
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 8,
    fontSize: 15,
  },
  fabricInput: {
    width: '100%',
    height: 44,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 8,
    fontSize: 15,
  },
  fallbackInput: {
    width: '100%',
    height: 44,
    borderWidth: 2,
    borderColor: '#ff9500',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff9f0',
    marginBottom: 8,
    fontSize: 15,
  },
  displayText: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default App;
