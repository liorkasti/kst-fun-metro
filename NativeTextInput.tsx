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

// Enhanced interface extending TextInputProps for better compatibility
interface CustomTextInputProps extends Omit<TextInputProps, 'onChangeText'> {
  onChangeText?: (text: string) => void;
}

// Native component reference with proper typing
let NativeTextInputComponent: React.ComponentType<NativeTextInputProps> | null =
  null;

try {
  NativeTextInputComponent =
    requireNativeComponent<NativeTextInputProps>('NativeTextInput');
} catch {
  console.warn(
    'Native TextInput component not found, falling back to regular TextInput',
  );
  NativeTextInputComponent = null;
}

export const NativeTextInput = forwardRef<TextInput, CustomTextInputProps>(
  ({ onChangeText, ...props }, ref) => {
    const textInputRef = useRef<TextInput>(null);

    // Expose TextInput methods to parent components
    useImperativeHandle(ref, () => textInputRef.current!, []);

    // Memoized change handler for better performance
    const handleChangeText = useCallback(
      (event: NativeSyntheticEvent<NativeTextInputChangeEvent>) => {
        onChangeText?.(event.nativeEvent.text);
      },
      [onChangeText],
    );

    console.log(
      'Does the %s work?\n',
      NativeTextInputComponent,
      NativeTextInputComponent
        ? 'Yes!\tUsing native NativeTextInput component'
        : 'No!\tFalling back to regular TextInput',
    );

    // Try to use native component first, fallback to regular TextInput if not available
    if (!NativeTextInputComponent) {
      return (
        <TextInput
          {...props}
          ref={textInputRef}
          onChangeText={onChangeText}
          style={props.style}
        />
      );
    }

    return (
      <NativeTextInputComponent
        {...(props as any)}
        onChangeText={handleChangeText}
        style={props.style}
        ref={ref}
      />
    );
  },
);

NativeTextInput.displayName = 'NativeTextInput';

export default NativeTextInput;
