#import <Cordova/CDV.h>

@interface MyPlugin : CDVPlugin

@property NSString *distanceLabel;
- (MyPlugin*)pluginInitialize;
- (void)echo:(CDVInvokedUrlCommand*)command;

@end