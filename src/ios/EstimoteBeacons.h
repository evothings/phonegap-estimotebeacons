#import <Cordova/CDV.h>
#import "ESTBeaconManager.h"

@interface EstimoteBeacons : CDVPlugin

@property NSArray *beacons;
@property ESTBeaconRegion* currentRegion;
@property NSString* connectionCallbackId;
@property NSString* firmwareUpdateProgress;
@property ESTBeacon* connectedBeacon;
@property NSMutableDictionary* regionWatchers;
- (EstimoteBeacons*)pluginInitialize;
@end