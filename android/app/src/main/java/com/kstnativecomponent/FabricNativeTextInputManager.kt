package com.kstnativecomponent

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * ✅ Fabric New Architecture Manager
 * Enhanced with JSI Direct Communication capabilities
 */
class FabricNativeTextInputManager : SimpleViewManager<FabricNativeTextInputView>() {

    override fun getName(): String {
        return "FabricNativeTextInput"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): FabricNativeTextInputView {
        return FabricNativeTextInputView(reactContext)
    }

    // ✅ Props - Same as Legacy for compatibility
    @ReactProp(name = "value")
    fun setValue(view: FabricNativeTextInputView, value: String?) {
        view.setText(value ?: "")
    }

    @ReactProp(name = "placeholder")
    fun setPlaceholder(view: FabricNativeTextInputView, placeholder: String?) {
        view.hint = placeholder ?: ""
    }

    @ReactProp(name = "secureTextEntry")
    fun setSecureTextEntry(view: FabricNativeTextInputView, secure: Boolean) {
        view.setSecureTextEntry(secure)
    }

    // ✅ Fabric Feature: Enhanced Event Registration with JSI
    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
            .put("onChangeText", MapBuilder.of<String, Any>(
                "phasedRegistrationNames", 
                MapBuilder.of<String, Any>("bubbled", "onChangeText")
            ))
            .put("onFabricFocus", MapBuilder.of<String, Any>(
                "phasedRegistrationNames", 
                MapBuilder.of<String, Any>("bubbled", "onFabricFocus")
            ))
            .put("onFabricBlur", MapBuilder.of<String, Any>(
                "phasedRegistrationNames", 
                MapBuilder.of<String, Any>("bubbled", "onFabricBlur")
            ))
            .build()
    }
}