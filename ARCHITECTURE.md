# Architecture - Native Component Fallback Strategy

## Overview

This project demonstrates a sophisticated fallback architecture where **child components signal their native availability status** to the parent, and the **parent component manages the rendering decision** - either native or JavaScript fallback.

## Key Design Principles

### 1. Single Source of Truth
- Parent component (`App.tsx`) is the **single authority** for deciding which component to render
- Child components **never render their own fallback** - they return `null` if native unavailable
- This prevents duplicate logic and ensures consistent behavior

### 2. Status Communication Pattern
Child components expose two mechanisms for status detection:

#### A. Callback Hook (`onNativeStatusChange`)
```tsx
<LegacyNativeTextInput 
  onNativeStatusChange={setIsLegacyNativeAvailable}
  // ... other props
/>
```
- Fires during component mount via `useEffect`
- Updates parent's state immediately
- Allows parent to react to native availability

#### B. Imperative Handle (`isNativeComponentAvailable`)
```tsx
const ref = useRef<ExtendedTextInputHandle>(null);
const isAvailable = ref.current?.isNativeComponentAvailable();
```
- Exposed via `useImperativeHandle` hook
- Allows parent to query status programmatically
- Useful for conditional logic outside render

## Implementation Details

### Child Component (Native Wrapper)

**File**: `specs/LegacyRCTViewManager/NativeTextInput.tsx`, `specs/JSINewArchitecture/NativeTextInput.tsx`

```tsx
interface ExtendedTextInputHandle {
  focus: () => void;
  clear: () => void;
  isFocused: () => boolean;
  isNativeComponentAvailable: () => boolean; // Status indicator
}

export const NativeTextInput = forwardRef<ExtendedTextInputHandle, Props>(
  ({ onNativeStatusChange, ...props }, ref) => {
    const isNativeAvailable = NativeComponent !== null;
    
    // Notify parent about native status
    useEffect(() => {
      onNativeStatusChange?.(isNativeAvailable);
    }, [isNativeAvailable, onNativeStatusChange]);
    
    // Expose imperative methods + status check
    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      clear: () => textInputRef.current?.clear(),
      isFocused: () => textInputRef.current?.isFocused() ?? false,
      isNativeComponentAvailable: () => isNativeAvailable,
    }), [isNativeAvailable]);
    
    // Return null if native unavailable - parent handles fallback
    if (!NativeComponent) {
      return null;
    }
    
    return <NativeComponent {...props} ref={textInputRef} />;
  }
);
```

### Parent Component (Orchestrator)

**File**: `App.tsx`

```tsx
function App() {
  // Track native availability for each architecture
  const [isLegacyNativeAvailable, setIsLegacyNativeAvailable] = useState(true);
  const [isFabricNativeAvailable, setIsFabricNativeAvailable] = useState(true);
  
  // Separate refs for native and fallback components
  const legacyInputRef = useRef<ExtendedTextInputHandle>(null);
  const legacyFallbackRef = useRef<TextInput>(null);
  
  return (
    <View>
      {/* Conditional rendering based on availability */}
      {isLegacyNativeAvailable ? (
        <LegacyNativeTextInput 
          ref={legacyInputRef}
          onNativeStatusChange={setIsLegacyNativeAvailable}
          // ... props
        />
      ) : (
        <TextInput 
          ref={legacyFallbackRef}
          // ... fallback props
        />
      )}
      
      {/* Status indicator */}
      <Text>Status: {isLegacyNativeAvailable ? 'Native ✓' : 'Fallback JS'}</Text>
    </View>
  );
}
```

## Architecture Benefits

### ✅ Centralized Control
- **Single place** for fallback logic (parent component)
- Easier to debug and maintain
- Consistent UI behavior across all native components

### ✅ Clear Separation of Concerns
- **Child**: Wraps native component, signals availability
- **Parent**: Decides what to render based on signals
- No mixed responsibilities

### ✅ TypeScript Safety
- `ExtendedTextInputHandle` interface ensures type safety
- Compile-time verification of status check method
- Prevents runtime errors from missing methods

### ✅ Flexibility
- Parent can implement custom fallback strategies
- Can combine multiple native availability states
- Easy to add logging, analytics, or error reporting

### ✅ Testability
- Mock `onNativeStatusChange` callback in tests
- Test native and fallback paths separately
- Verify parent's decision logic independently

## Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      PARENT COMPONENT                        │
│                         (App.tsx)                            │
│                                                              │
│  State: isLegacyNativeAvailable = true                      │
│  State: isFabricNativeAvailable = true                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Conditional Rendering Logic                       │    │
│  │                                                     │    │
│  │  {isLegacyNativeAvailable ?                        │    │
│  │    <LegacyNativeTextInput /> :                     │    │
│  │    <TextInput /> // Fallback                       │    │
│  │  }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                          ▲                                   │
│                          │                                   │
│                          │ onNativeStatusChange(false)      │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          │                                   │
│                  CHILD COMPONENT                             │
│            (LegacyNativeTextInput)                           │
│                                                              │
│  useEffect(() => {                                          │
│    onNativeStatusChange?.(isNativeAvailable); ◄─────────┐  │
│  }, [isNativeAvailable]);                        │       │  │
│                                                  │       │  │
│  const isNativeAvailable = NativeComponent !== null;    │  │
│                                                  │       │  │
│  if (!NativeComponent) {                         │       │  │
│    return null; // Parent handles fallback ──────┘       │  │
│  }                                                       │  │
│                                                          │  │
│  return <NativeComponent />;                             │  │
└──────────────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Auto-Focus on Clear
**Smart UX Pattern**: When user clears one input, auto-focus switches to the other
```tsx
const handleLegacyChange = (text: string) => {
  setLegacyText(text);
  // If Legacy input is cleared, auto-focus Fabric input
  if (text === '' && fabricText !== '') {
    fabricInputRef.current?.focus();
  }
};

// After clearing both, focus on first input
const clearInputs = () => {
  legacyInputRef.current?.clear();
  fabricInputRef.current?.clear();
  setLegacyText('');
  setFabricText('');
  
  // Auto-focus Legacy input after clearing
  setTimeout(() => {
    legacyInputRef.current?.focus();
  }, 100);
};
```

### Example 2: Clear All Inputs
```tsx
const clearInputs = () => {
  // Use appropriate ref based on availability
  if (isLegacyNativeAvailable) {
    legacyInputRef.current?.clear();
  } else {
    legacyFallbackRef.current?.clear();
  }
};
```

### Example 3: Check Availability Programmatically
```tsx
const checkStatus = () => {
  const isAvailable = legacyInputRef.current?.isNativeComponentAvailable();
  console.log('Native component available:', isAvailable);
};
```

### Example 4: Custom UI Based on Status
```tsx
<Text style={styles.description}>
  {isLegacyNativeAvailable
    ? 'Bridge-based communication with JSON serialization'
    : 'Fallback: Using JavaScript TextInput (Native unavailable)'}
</Text>
```

## Comparison: Old vs New Architecture

### ❌ Old Architecture (Fallback in Child)
```tsx
// Child component
if (!NativeComponent) {
  return <TextInput {...props} />; // Child decides fallback
}
return <NativeComponent {...props} />;

// Parent component
<LegacyNativeTextInput /> // No control over fallback
```

**Problems:**
- Parent has no visibility into native availability
- Fallback logic scattered across multiple children
- Hard to customize fallback behavior
- Difficult to test and debug

### ✅ New Architecture (Fallback in Parent)
```tsx
// Child component
if (!NativeComponent) {
  return null; // Let parent decide
}
return <NativeComponent {...props} />;

// Parent component
{isNativeAvailable ? (
  <LegacyNativeTextInput 
    onNativeStatusChange={setIsNativeAvailable}
  />
) : (
  <TextInput /> // Parent controls fallback
)}
```

**Benefits:**
- Parent has full visibility and control
- Centralized fallback logic
- Easy to customize per use case
- Better testability and debugging

## Future Enhancements

1. **Error Boundary Integration**: Catch native crashes and switch to fallback
2. **Performance Monitoring**: Track native vs fallback usage
3. **A/B Testing**: Dynamically switch between native and fallback
4. **Analytics**: Report which users see native vs fallback
5. **Progressive Enhancement**: Start with fallback, upgrade to native when available

---

**Last Updated**: October 29, 2025  
**Author**: Lior Kastenbaum  
**Project**: KST Native Component - React Native 0.82.1
