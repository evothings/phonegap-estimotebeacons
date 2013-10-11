#import <Cordova/CDV.h>

@interface MyPlugin : CDVPlugin

@property NSString *distanceLabel;
- (MyPlugin*)init;
- (void)echo:(CDVInvokedUrlCommand*)command;

@end