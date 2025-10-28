# KSTNativeComponent - Native TextInput Component

🎯 **Project Goal**: Create a custom TextInput component that operates at the native platform level instead of the JavaScript layer, demonstrating cross-platform native UI component development with React Native.

![React Native](https://img.shields.io/badge/React%20Native-0.82.1-blue?style=flat-square&logo=react)
![iOS](https://img.shields.io/badge/iOS-Swift%20%2B%20Objective--C-orange?style=flat-square&logo=ios)
![Android](https://img.shields.io/badge/Android-Kotlin-green?style=flat-square&logo=android)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## � Quick Start

```bash
# Clone and setup
git clone https://github.com/liorkasti/kst-native-component.git
cd kst-native-component
npm install

# iOS setup
cd ios && bundle install && bundle exec pod install && cd ..

# Run
npm run android  # Android
npm run ios      # iOS
```

**⚠️ iOS Note**: For full native component functionality, manually add Swift files to Xcode project:
1. Open `ios/KSTNativeComponent.xcworkspace`
2. Drag `NativeTextInputManager.swift`, `NativeTextInputView.swift`, `NativeTextInputManager.m` to project
3. Ensure files are added to `KSTNativeComponent` target

## 📋 Table of Contents

- [🔍 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [�️ Implementation](#️-implementation)
- [� Performance](#-performance)
- [📚 Learn More](#-learn-more)

## 🔍 Overview

This project demonstrates a **Native UI Component** for React Native - a TextInput that uses platform-specific native views:

- **iOS**: `UITextField` (Swift + Objective-C Bridge)
- **Android**: `EditText` (Kotlin)
- **Fallback**: Intelligent detection with regular TextInput backup

### Why Native Components?

| Feature | Native | JavaScript |
|---------|--------|------------|
| **Performance** | ⚡ Direct rendering | 🐌 Bridge overhead |
| **Platform Feel** | 🎯 100% native | 🔄 Approximated |
| **Memory** | 💾 Efficient | 📈 JS heap |
| **Features** | 🔓 Full APIs | 🔒 Limited |

## 🏗️ Architecture

**Technology Stack**: React Native 0.82.1 with **New Architecture Enabled** (Fabric + Turbo Modules)

**⚠️ Architecture Note**: While the app runs with **Fabric UI Manager enabled**, this component demonstrates **Legacy Native Component APIs** for educational purposes and backward compatibility.

| Configuration | This Project | Pure Legacy |
|---------------|--------------|-------------|
| **UI Manager** | ✅ Fabric Enabled | Legacy UI Manager |
| **Component API** | Legacy RCTViewManager | Legacy RCTViewManager |
| **Compatibility** | Backward compatible | Native only |
| **Performance** | Fabric optimizations | Bridge bottleneck |

## 🛠️ Implementation

### Project Structure
```
📦 KSTNativeComponent/
├── 📱 ios/KSTNativeComponent/
│   ├── NativeTextInputManager.swift    # ViewManager
│   ├── NativeTextInputView.swift       # UITextField Wrapper  
│   └── NativeTextInputManager.m        # Objective-C Bridge
├── 🤖 android/.../com/kstnativecomponent/
│   ├── NativeTextInputManager.kt       # ViewManager
│   ├── NativeTextInputPackage.kt       # Registration
│   └── NativeTextInputView.kt          # EditText Wrapper
└── 🌐 NativeTextInput.tsx              # TypeScript Interface
```

### Platform Implementation

**iOS (Swift + Objective-C)**
```swift
// ViewManager
@objc(NativeTextInputManager)
class NativeTextInputManager: RCTViewManager {
  override func view() -> UIView! { return NativeTextInputView() }
}

// UITextField Wrapper
class NativeTextInputView: UIView {
  private var textField: UITextField!
  // Native implementation with events
}
```

**Android (Kotlin)**
```kotlin
// ViewManager
class NativeTextInputManager : SimpleViewManager<NativeTextInputView>() {
  override fun getName(): String = "NativeTextInput"
}

// EditText Wrapper
class NativeTextInputView(context: Context) : EditText(context) {
  // Native implementation with TextWatcher
}
```

**JavaScript Interface**
```typescript
// Smart Fallback System
let NativeTextInputComponent: any;
try {
  NativeTextInputComponent = requireNativeComponent('NativeTextInput');
} catch {
  NativeTextInputComponent = null; // Falls back to regular TextInput
}
```

## 📊 Performance

### Architecture Reality Check

**What's Actually Running:**
```
┌─ React Native 0.82.1 ─┐
│  Fabric UI Manager     │ ← ✅ ENABLED (newArchEnabled=true)
│  Turbo Modules        │ ← ✅ ENABLED  
├────────────────────────┤
│  Your Native Component │ ← 🔧 Legacy API (RCTViewManager)
│  (Backward Compatible) │ ← Works via compatibility layer
└────────────────────────┘
```

**Key Insight**: The app uses **Fabric for performance** but demonstrates **RCTViewManager** instead of **Fabric Component** - best of both worlds!

### iOS Implementation

#### 1. Swift ViewManager (`NativeTextInputManager.swift`)
```swift
@objc(NativeTextInputManager)
class NativeTextInputManager: RCTViewManager {
  override func view() -> UIView! {
    return NativeTextInputView()
  }
}
```

#### 2. UITextField Wrapper (`NativeTextInputView.swift`)
```swift
class NativeTextInputView: UIView {
  private var textField: UITextField!
  // Native UITextField implementation with text change events
}
```

#### 3. Objective-C Bridge (`NativeTextInputManager.m`)
```objc
@interface RCT_EXTERN_MODULE(NativeTextInputManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(value, NSString)
// Export properties to React Native
@end
```

### Android Implementation

#### 1. Package Registration (`NativeTextInputPackage.kt`)
```kotlin
class NativeTextInputPackage : ReactPackage {
  override fun createViewManagers(): List<ViewManager<*, *>> {
    return listOf(NativeTextInputManager())
  }
}
```

#### 2. ViewManager (`NativeTextInputManager.kt`)
```kotlin
class NativeTextInputManager : SimpleViewManager<NativeTextInputView>() {
  override fun getName(): String = "NativeTextInput"
  // Property and event management
}
```

#### 3. EditText Wrapper (`NativeTextInputView.kt`)
```kotlin
class NativeTextInputView(context: Context) : EditText(context) {
  // Native EditText implementation with TextWatcher
}
```

### JavaScript/TypeScript Bridge

#### Smart Fallback Mechanism (`NativeTextInput.tsx`)
```typescript
let NativeTextInputComponent: any;

try {
  NativeTextInputComponent = requireNativeComponent<Props>('NativeTextInput');
} catch {
  console.warn('Native TextInput component not found, falling back to regular TextInput');
  NativeTextInputComponent = null;
}

export const NativeTextInput: React.FC<Props> = ({ onChangeText, ...props }) => {
  // Intelligent fallback to regular TextInput when native component unavailable
  if (!NativeTextInputComponent) {
    return <TextInput {...props} style={enhancedStyle} />;
  }

  const handleChangeText = (event) => {
    onChangeText?.(event.nativeEvent.text);
  };

  return <NativeTextInputComponent {...props} onChangeText={handleChangeText} />;
};
```

## 📊 Performance Comparison

### Architecture Comparison: Legacy vs New

### Performance: Fabric + Legacy Components

| Feature | Your Setup | Pure Legacy | Pure New Arch |
|---------|------------|-------------|---------------|
| **UI Manager** | ✅ Fabric Renderer | Legacy UI Manager | Fabric Renderer |
| **Component API** | Legacy (Compatible) | Legacy Native | Fabric Component |
| **Communication** | Fabric + Bridge | JS Bridge (Async) | JSI Direct (Sync) |
| **Performance** | 🚀 Hybrid Optimized | 🐌 Bridge bottleneck | ⚡ Full Speed |
| **Learning Value** | 🎯 Perfect Balance | Good for basics | Complex setup |

### Implementation Details

**Configuration Files:**
- `android/gradle.properties`: `newArchEnabled=true` ✅
- `ios/KSTNativeComponent/Info.plist`: `RCTNewArchEnabled=true` ✅
- Component Code: Legacy RCTViewManager (backward compatible) ✅

### iOS: RCTViewManager (Bridge-based)
- ✅ Bridge-based communication
- ✅ RCTViewManager for component management
- ✅ Objective-C bridging between Swift and React Native
- ✅ Main thread UI operations

### Android: SimpleViewManager (Bridge-based)
- ✅ SimpleViewManager for simple view management
- ✅ @ReactProp annotations for property binding
- ✅ Bridge communication with JavaScript
- ✅ Event emission to JavaScript layer


## 📖 Resources
- **[Native Modules Introduction](https://reactnative.dev/docs/legacy/native-modules-intro)** - Understanding React Native native modules
- **[Native UI Components (Legacy)](https://reactnative.dev/docs/legacy/native-components-ios)** - Official legacy iOS native components guide
- **[Native UI Components Android (Legacy)](https://reactnative.dev/docs/legacy/native-components-android)** - Official legacy Android native components guide
- **[New Architecture Overview](https://reactnative.dev/docs/new-architecture-intro)** - Fabric & Turbo Modules documentation
- **[Bridging in React Native](https://reactnative.dev/docs/communication-ios)** - Communication between native and JavaScript
- **[RCTViewManager.h](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Views/RCTViewManager.h)** - RCTViewManager header file
- **[UITextField Documentation](https://developer.apple.com/documentation/uikit/uitextfield)** - Apple's UITextField official documentation
- **[EditText Documentation](https://developer.android.com/reference/android/widget/EditText)** - Android's EditText official documentation
- **[Android UI Components](https://developer.android.com/guide/topics/ui/controls)** - Android UI controls guide
- **[React Native Architecture Overview](https://reactnative.dev/docs/architecture-overview)** - Complete architecture documentation
- **[Create a Fabric Native Component](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md)** - New Architecture Workflows documentation  
- **[Fabric Renderer](https://reactnative.dev/docs/fabric-renderer)** - New UI layer documentation  
- **[Create a Turbo Native Modules](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md)** - New native modules system documentation