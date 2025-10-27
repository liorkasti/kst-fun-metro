import UIKit
import React

class NativeTextInputView: UIView {
  private var textField: UITextField!
  private var onChangeText: RCTDirectEventBlock?
  
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
    textField.backgroundColor = UIColor.white
    textField.textColor = UIColor.black
    textField.layer.borderWidth = 1
    textField.layer.borderColor = UIColor.lightGray.cgColor
    textField.layer.cornerRadius = 8
    textField.font = UIFont.systemFont(ofSize: 16)
    
    // Add padding
    textField.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 15, height: textField.frame.height))
    textField.leftViewMode = .always
    textField.rightView = UIView(frame: CGRect(x: 0, y: 0, width: 15, height: textField.frame.height))
    textField.rightViewMode = .always
    
    // Add native text change handling
    textField.addTarget(self, action: #selector(textFieldDidChange), for: .editingChanged)
    
    addSubview(textField)
    textField.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      textField.topAnchor.constraint(equalTo: topAnchor),
      textField.leadingAnchor.constraint(equalTo: leadingAnchor),
      textField.trailingAnchor.constraint(equalTo: trailingAnchor),
      textField.bottomAnchor.constraint(equalTo: bottomAnchor),
      textField.heightAnchor.constraint(equalToConstant: 40)
    ])
  }
  
  @objc private func textFieldDidChange() {
    // Send change event to React Native
    if let onChangeText = onChangeText {
      onChangeText(["text": textField.text ?? ""])
    }
  }
  
  @objc func setValue(_ value: String) {
    textField.text = value
  }
  
  @objc func setPlaceholder(_ placeholder: String) {
    textField.placeholder = placeholder
  }
  
  @objc func setSecureTextEntry(_ secure: Bool) {
    textField.isSecureTextEntry = secure
  }
  
  @objc func setOnChangeText(_ onChangeText: @escaping RCTDirectEventBlock) {
    self.onChangeText = onChangeText
  }
}