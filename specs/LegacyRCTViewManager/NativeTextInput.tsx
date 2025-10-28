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
 * LEGACY ARCHITECTURE COMPONENT
 *
 * This component demonstrates the traditional React Native Bridge architecture.
 *
 * COMMUNICATION FLOW:
 * 1. JavaScript calls requireNativeComponent
 * 2. Bridge serializes props to JSON
 * 3. JSON sent to Native thread
 * 4. Native deserializes and creates UIView/Android View
 * 5. Events serialized back to JSON
 * 6. Bridge sends JSON to JavaScript
 * 7. JavaScript deserializes and triggers callbacks
 *
 * WHEN TO USE RCTViewManager:
 * - Pre-RN 0.68 projects (before Fabric)
 * - When targeting older React Native versions
 * - When Fabric is disabled (newArchEnabled=false)
 * - Simpler components that don't need peak performance
 * - Compatibility with existing native modules
 *
 * LIMITATIONS:
 * - Asynchronous communication (can cause UI lag)
 * - JSON serialization overhead
 * - Cannot call synchronous native methods
 * - Higher memory usage due to data copying
 */

interface NativeTextInputChangeEvent {
  text: string;
}

interface NativeTextInputProps {
  style?: ViewStyle;
  value?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
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

let NativeTextInputComponent: React.ComponentType<NativeTextInputProps> | null =
  null;

try {
  NativeTextInputComponent =
    requireNativeComponent<NativeTextInputProps>('NativeTextInput');
  console.log(
    'NativeTextInput: Using native NativeTextInput component with RCTViewManager',
  );
} catch {
  console.warn('Legacy native component not found, will signal to parent');
  NativeTextInputComponent = null;
}

export const NativeTextInput = forwardRef<
  ExtendedTextInputHandle,
  CustomTextInputProps
>(({ onChangeText, onNativeStatusChange, ...props }, ref) => {
  const textInputRef = useRef<TextInput>(null);
  const isNativeAvailable = NativeTextInputComponent !== null;

  /**
   * Notify parent component about native availability status
   */
  React.useEffect(() => {
    onNativeStatusChange?.(isNativeAvailable);
  }, [isNativeAvailable, onNativeStatusChange]);

  /**
   * Expose native TextInput imperative methods plus status check
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
   * Bridge event handler - converts native event to JS callback
   * Data flow: Native Event -> JSON -> Bridge -> JS Object -> Callback
   */
  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<NativeTextInputChangeEvent>) => {
      onChangeText?.(event.nativeEvent.text);
    },
    [onChangeText],
  );

  /**
   * Always render the native component (parent handles fallback)
   * Props are serialized to JSON and sent across the bridge
   */
  if (!NativeTextInputComponent) {
    return null; // Parent will render fallback
  }

  return (
    <NativeTextInputComponent
      {...(props as any)}
      onChangeText={handleChangeText}
      style={props.style}
      ref={textInputRef}
    />
  );
});

NativeTextInput.displayName = 'NativeTextInput';

export default NativeTextInput;
