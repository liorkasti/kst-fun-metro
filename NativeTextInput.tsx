import React from 'react';
import {
  requireNativeComponent,
  ViewStyle,
  NativeSyntheticEvent,
  TextInput,
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

interface CustomTextInputProps
  extends Omit<NativeTextInputProps, 'onChangeText'> {
  onChangeText?: (text: string) => void;
}

let NativeTextInputComponent: any;

try {
  NativeTextInputComponent =
    requireNativeComponent<NativeTextInputProps>('NativeTextInput');
} catch {
  console.warn(
    'Native TextInput component not found, falling back to regular TextInput',
  );
  NativeTextInputComponent = null;
}

export const NativeTextInput: React.FC<CustomTextInputProps> = ({
  onChangeText,
  ...props
}) => {
  console.log(
    'Does the %s work?\n',
    NativeTextInputComponent,
    NativeTextInputComponent
      ? 'Using native NativeTextInput component'
      : 'Falling back to regular TextInput',
  );

  // Try to use native component first, fallback to regular TextInput if not available
  if (!NativeTextInputComponent) {
    return (
      <TextInput
        {...props}
        onChangeText={onChangeText}
        style={[
          {
            height: 40,
            paddingHorizontal: 15,
            backgroundColor: 'white',
            color: 'black',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
          },
          props.style,
        ]}
      />
    );
  }

  const handleChangeText = (
    event: NativeSyntheticEvent<NativeTextInputChangeEvent>,
  ) => {
    onChangeText?.(event.nativeEvent.text);
  };

  return (
    <NativeTextInputComponent {...props} onChangeText={handleChangeText} />
  );
};

export default NativeTextInput;
