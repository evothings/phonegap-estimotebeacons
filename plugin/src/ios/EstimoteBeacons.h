#import <Cordova/CDV.h>
#import "ESTBeaconManager.h"
#import "ESTNearableManager.h"
#import "ESTTriggerManager.h"

@interface EstimoteBeacons : CDVPlugin

- (EstimoteBeacons*) pluginInitialize;
- (void) onReset;

@end
