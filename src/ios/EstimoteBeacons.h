#import <Cordova/CDV.h>
#import "ESTBeaconManager.h"

@interface EstimoteBeacons : CDVPlugin

@property (nonatomic, strong) NSArray *beacons;
@property (nonatomic, strong) ESTBeaconRegion* currentRegion;
@property (nonatomic, strong) NSString* connectionCallbackId;
@property (nonatomic, strong) NSString* firmwareUpdateProgress;
@property (nonatomic, strong) ESTBeacon* connectedBeacon;
@property (nonatomic, strong) NSMutableDictionary* regionWatchers;

- (EstimoteBeacons*)pluginInitialize;

@end