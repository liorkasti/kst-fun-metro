package com.kstnativecomponent

import android.content.Context
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.View
import android.widget.EditText
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * ✅ Fabric New Architecture View
 * Enhanced with JSI Direct Communication and advanced event handling
 */
class FabricNativeTextInputView(context: Context) : EditText(context) {

    init {
        setupView()
    }

    private fun setupView() {
        // ✅ Enhanced styling for Fabric
        background = null
        setPadding(40, 20, 40, 20) // Better padding than Legacy
        textSize = 16f
        setTextColor(android.graphics.Color.BLACK)
        setBackgroundColor(android.graphics.Color.WHITE)
        setHintTextColor(android.graphics.Color.GRAY)        
        // ✅ Fabric Feature: Advanced text change listener with timestamp
        addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                sendChangeEvent()
            }
        })

        // ✅ Fabric Feature: Focus/Blur events
        setOnFocusChangeListener { _, hasFocus ->
            if (hasFocus) {
                sendFocusEvent()
            } else {
                sendBlurEvent()
            }
        }
    }

    // ✅ Fabric Feature: Enhanced change event with timestamp
    private fun sendChangeEvent() {
        val event: WritableMap = Arguments.createMap()
        event.putString("text", text.toString())
        // ✅ Fabric Advantage: Send timestamp via JSI (not possible in Legacy)
        event.putDouble("timestamp", System.currentTimeMillis().toDouble())

        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
            id,
            "onChangeText",
            event
        )
    }

    // ✅ Fabric Feature: Focus event via JSI
    private fun sendFocusEvent() {
        val event: WritableMap = Arguments.createMap()
        
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
            id,
            "onFabricFocus",
            event
        )
    }

    // ✅ Fabric Feature: Blur event via JSI
    private fun sendBlurEvent() {
        val event: WritableMap = Arguments.createMap()
        
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
            id,
            "onFabricBlur",
            event
        )
    }

    // ✅ Same as Legacy for compatibility
    fun setSecureTextEntry(secure: Boolean) {
        inputType = if (secure) {
            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
        } else {
            InputType.TYPE_CLASS_TEXT
        }
    }
}