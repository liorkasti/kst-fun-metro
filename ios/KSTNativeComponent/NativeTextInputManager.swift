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
}