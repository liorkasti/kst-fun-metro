import UIKit
import React

@objc(FabricNativeTextInputManager)
class FabricNativeTextInputManager: RCTViewManager {
  
  override func view() -> UIView! {
    return FabricNativeTextInputView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
