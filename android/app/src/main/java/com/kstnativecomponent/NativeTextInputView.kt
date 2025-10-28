package com.kstnativecomponent

import android.content.Context
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.widget.EditText
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap

class NativeTextInputView(context: Context) : EditText(context) {
    
    private val reactContext = context as ReactContext
    
    init {
        setupEditText()
    }
    
    private fun setupEditText() {
        // Set default styling
        setPadding(40, 20, 40, 20)
        textSize = 16f
        setTextColor(android.graphics.Color.BLACK)
        setBackgroundColor(android.graphics.Color.WHITE)
        setHintTextColor(android.graphics.Color.GRAY)
        
        // Add native text change handling
        addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            
            override fun afterTextChanged(s: Editable?) {
                onTextChanged(s?.toString() ?: "")
            }
        })
    }
    
    @Suppress("DEPRECATION")
    private fun onTextChanged(text: String) {
        val event: WritableMap = Arguments.createMap()
        event.putString("text", text)
        
        reactContext
            .getJSModule(com.facebook.react.uimanager.events.RCTEventEmitter::class.java)
            .receiveEvent(id, "onChangeText", event)
    }
    
    fun setValue(value: String) {
        if (text.toString() != value) {
            setText(value)
        }
    }
    
    fun setPlaceholder(placeholder: String) {
        hint = placeholder
    }
    
    fun setSecureTextEntry(secure: Boolean) {
        inputType = if (secure) {
            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
        } else {
            InputType.TYPE_CLASS_TEXT
        }
    }
}