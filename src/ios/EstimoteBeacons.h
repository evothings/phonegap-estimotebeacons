#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"
#import "ESTBeaconManager.h"

@interface EstimoteBeacons : CDVPlugin

@property NSArray *beacons;
@property ESTBeaconRegion* currentRegion;
- (EstimoteBeacons*)pluginInitialize;
@end