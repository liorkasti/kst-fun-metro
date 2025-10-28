import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import {
  requireNativeComponent,
  ViewStyle,
  NativeSyntheticEvent,
  TextInput,
  TextInputProps,
} from 'react-native';

/**
 * FABRIC (NEW ARCHITECTURE) COMPONENT
 *
 * This component demonstrates React Native's modern Fabric renderer with JSI.
 *
 * COMMUNICATION FLOW:
 * 1. JavaScript calls requireNativeComponent
 * 2. JSI creates direct binding to C++ native component
 * 3. Props passed via direct memory access (no serialization)
 * 4. Native component renders directly
 * 5. Events sent via JSI callbacks (direct function invocation)
 * 6. JavaScript receives native data immediately
 *
 * WHEN TO USE FABRIC/JSI:
 * - RN 0.68+ projects with newArchEnabled=true
 * - Performance-critical components
 * - Real-time data updates (animations, gestures)
 * - Synchronous native method calls needed
 * - Large data transfers between JS and Native
 * - Modern apps targeting latest RN versions
 *
 * ADVANTAGES:
 * - Direct memory access (no JSON serialization)
 * - Synchronous calls when needed
 * - Lower latency for events
 * - Better performance and lower memory usage
 * - Type-safe with CodeGen
 *
 * JSI vs BRIDGE COMPARISON:
 * Bridge: JS -> JSON -> Native Thread -> JSON -> JS
 * JSI:    JS -> Direct C++ Call -> Native Thread -> Direct Callback -> JS
 */

interface NativeTextInputChangeEvent {
  text: string;
  timestamp?: number; // Fabric only: JSI direct access to timestamp
}

interface NativeTextInputNativeProps {
  style?: ViewStyle;
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  // Fabric Event: Using JSI for optimal performance
  onChangeText?: (
    event: NativeSyntheticEvent<NativeTextInputChangeEvent>,
  ) => void;
}

interface CustomTextInputProps extends Omit<TextInputProps, 'onChangeText'> {
  onChangeText?: (text: string) => void;
  onNativeStatusChange?: (isNativeAvailable: boolean) => void;
}

/**
 * Extended TextInput interface with native status check
 */
interface ExtendedTextInputHandle {
  focus: () => void;
  clear: () => void;
  isFocused: () => boolean;
  isNativeComponentAvailable: () => boolean;
}

let NativeFabricComponent: React.ComponentType<NativeTextInputNativeProps> | null =
  null;

try {
  NativeFabricComponent = requireNativeComponent<NativeTextInputNativeProps>(
    'FabricNativeTextInput',
  );
  console.log('NativeTextInput: Using Fabric with JSI Direct Communication');
} catch {
  console.warn('Fabric component not found, will signal to parent');
  NativeFabricComponent = null;
}

export const NativeTextInput = forwardRef<
  ExtendedTextInputHandle,
  CustomTextInputProps
>(({ onChangeText, onNativeStatusChange, ...props }, ref) => {
  const textInputRef = useRef<TextInput>(null);
  const isNativeAvailable = NativeFabricComponent !== null;

  /**
   * Notify parent component about native availability status
   */
  React.useEffect(() => {
    onNativeStatusChange?.(isNativeAvailable);
  }, [isNativeAvailable, onNativeStatusChange]);

  /**
   * Expose imperative methods plus status check
   * Parent can call ref.current.isNativeComponentAvailable()
   */
  useImperativeHandle(
    ref,
    () => ({
      focus: () => textInputRef.current?.focus(),
      clear: () =>
        textInputRef.current?.clear?.() ||
        textInputRef.current?.setNativeProps?.({ text: '' }),
      isFocused: () => textInputRef.current?.isFocused() ?? false,
      isNativeComponentAvailable: () => isNativeAvailable,
    }),
    [isNativeAvailable],
  );

  /**
   * JSI event handler - Direct callback invocation
   * Data flow: Native Event -> JSI Direct Call -> JS Callback
   * No JSON serialization, direct memory access to event data
   *
   * Note: timestamp is example of JSI-only feature not available in Bridge
   */
  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<NativeTextInputChangeEvent>) => {
      const { text, timestamp } = event.nativeEvent;
      if (timestamp) {
        console.log(`Fabric Event: Text changed at ${timestamp}ms`);
      }
      onChangeText?.(text);
    },
    [onChangeText],
  );

  /**
   * Always render the Fabric component (parent handles fallback)
   * Props transferred via direct memory pointers (HostObject)
   * Events use JSI callbacks for immediate invocation
   */
  if (!NativeFabricComponent) {
    return null; // Parent will render fallback
  }

  return (
    <NativeFabricComponent
      {...(props as any)}
      onChangeText={handleChangeText}
      style={props.style}
      ref={textInputRef}
    />
  );
});

NativeTextInput.displayName = 'NativeTextInput';

export default NativeTextInput;
