import UIKit
import React

@objc(NativeTextInputManager)
class NativeTextInputManager: RCTViewManager {
  
  override func view() -> UIView! {
    return NativeTextInputView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Export props to React Native
  @objc func setValue(_ node: NSNumber, value: String) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! NativeTextInputView
      component.setValue(value)
    }
  }
  
  @objc func setPlaceholder(_ node: NSNumber, placeholder: String) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! NativeTextInputView
      component.setPlaceholder(placeholder)
    }
  }
  
  @objc func setSecureTextEntry(_ node: NSNumber, secure: Bool) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(forReactTag: node) as! NativeTextInputView
      component.setSecureTextEntry(secure)
    }
  }
}