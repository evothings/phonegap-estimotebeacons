#import <Cordova/CDV.h>

@interface EstimoteBeacons : CDVPlugin

@property NSString *distanceLabel;
- (EstimoteBeacons*)pluginInitialize;
- (void)getClosestBeaconDistance:(CDVInvokedUrlCommand*)command;

@end