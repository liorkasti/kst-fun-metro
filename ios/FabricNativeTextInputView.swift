import UIKit
import React

class FabricNativeTextInputView: UIView {
  private var textField: UITextField!
  @objc var onChangeText: RCTDirectEventBlock?
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    // Ensure wrapper UIView has no visual styling
    self.backgroundColor = UIColor.clear
    self.layer.borderWidth = 0
    self.clipsToBounds = true
    setupTextField()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    self.backgroundColor = UIColor.clear
    self.layer.borderWidth = 0
    self.clipsToBounds = true
    setupTextField()
  }
  
  // Override to prevent React Native from adding borders/background to wrapper
  override func layoutSubviews() {
    super.layoutSubviews()
    self.layer.borderWidth = 0
    self.layer.borderColor = nil
  }
  
  private func setupTextField() {
    textField = UITextField()
    textField.borderStyle = .none
    textField.backgroundColor = UIColor.clear
    textField.textColor = UIColor.black
    textField.font = UIFont.systemFont(ofSize: 15)
    
    // No padding views - let React Native styles handle everything
    
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
    
    // Make wrapper completely invisible
    self.isOpaque = false
    self.layer.masksToBounds = false
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
