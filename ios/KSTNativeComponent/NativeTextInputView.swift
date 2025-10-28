import UIKit
import React

class NativeTextInputView: UIView {
  private var textField: UITextField!
  @objc var onChangeText: RCTDirectEventBlock?
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupTextField()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupTextField()
  }
  
  private func setupTextField() {
    textField = UITextField()
    textField.borderStyle = .none
    textField.backgroundColor = UIColor.clear  // Remove background
    textField.textColor = UIColor.black
    // Remove border styling - let React Native handle it
    textField.font = UIFont.systemFont(ofSize: 16)
    
    // Add minimal padding only
    textField.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: textField.frame.height))
    textField.leftViewMode = .always
    textField.rightView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: textField.frame.height))
    textField.rightViewMode = .always
    
    // Add native text change handling
    textField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
    
    addSubview(textField)
    textField.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      textField.topAnchor.constraint(equalTo: topAnchor),
      textField.leadingAnchor.constraint(equalTo: leadingAnchor),
      textField.trailingAnchor.constraint(equalTo: trailingAnchor),
      textField.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])
  }
  
  @objc private func textFieldDidChange() {
    guard let onChangeText = onChangeText else { return }
    onChangeText(["text": textField.text ?? ""])
  }
  
  @objc var value: String = "" {
    didSet {
      textField.text = value
    }
  }
  
  @objc var placeholder: String = "" {
    didSet {
      textField.placeholder = placeholder
    }
  }
  
  @objc var secureTextEntry: Bool = false {
    didSet {
      textField.isSecureTextEntry = secureTextEntry
    }
  }
}