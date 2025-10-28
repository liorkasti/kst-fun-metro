package com.kstnativecomponent

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class NativeTextInputManager : SimpleViewManager<NativeTextInputView>() {
    
    override fun getName(): String {
        return "NativeTextInput"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): NativeTextInputView {
        return NativeTextInputView(reactContext)
    }

    @ReactProp(name = "value")
    fun setValue(view: NativeTextInputView, value: String?) {
        view.setValue(value ?: "")
    }

    @ReactProp(name = "placeholder")
    fun setPlaceholder(view: NativeTextInputView, placeholder: String?) {
        view.setPlaceholder(placeholder ?: "")
    }

    @ReactProp(name = "secureTextEntry")
    fun setSecureTextEntry(view: NativeTextInputView, secure: Boolean) {
        view.setSecureTextEntry(secure)
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return mapOf(
            "onChangeText" to mapOf("registrationName" to "onChangeText")
        )
    }
}