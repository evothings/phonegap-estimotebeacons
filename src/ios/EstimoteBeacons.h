#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"
#import "ESTBeaconManager.h"

@interface EstimoteBeacons : CDVPlugin

@property NSArray *beacons;
@property ESTBeaconRegion* currentRegion;
- (EstimoteBeacons*)pluginInitialize;
- (NSMutableDictionary*)beaconToDictionary:(ESTBeacon*)beacon;

- (void)startEstimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command;
- (void)stopEsimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command;
- (void)startRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command;
- (void)stopRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command;

- (void)getBeacons:(CDVInvokedUrlCommand*)command;
- (void)getBeaconByIdx:(CDVInvokedUrlCommand*)command;
- (void)getClosestBeacon:(CDVInvokedUrlCommand*)command;

@end