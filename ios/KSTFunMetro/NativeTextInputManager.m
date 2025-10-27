#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(NativeTextInputManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(value, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(secureTextEntry, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTDirectEventBlock)

@end