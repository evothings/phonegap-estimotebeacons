#import "EstimoteBeacons.h"
#import <Cordova/CDV.h>
#import "ESTBeaconManager.h"

@interface EstimoteBeacons () <ESTBeaconManagerDelegate>

@property (nonatomic, strong) ESTBeaconManager* beaconManager;

@end

@implementation EstimoteBeacons

- (EstimoteBeacons*)pluginInitialize
{
    // craete manager instance
    self.beaconManager = [[ESTBeaconManager alloc] init];
    self.beaconManager.delegate = self;
        
    // create sample region object (you can additionaly pass major / minor values)
    ESTBeaconRegion* region = [[ESTBeaconRegion alloc] initRegionWithIdentifier:@"EstimoteSampleRegion"];
        
    // start looking for estimtoe beacons in region
    // when beacon ranged beaconManager:didRangeBeacons:inRegion: invoked
    [self.beaconManager startRangingBeaconsInRegion:region];
        
    self.distanceLabel = @"INIT";
    
    return self;
}

- (void)getClosestBeaconDistance:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult  = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.distanceLabel];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)beaconManager:(ESTBeaconManager *)manager
     didRangeBeacons:(NSArray *)beacons
            inRegion:(ESTBeaconRegion *)region
{
    if([beacons count] > 0)
    {
        // beacon array is sorted based on distance
        // closest beacon is the first one
        ESTBeacon* closestBeacon = [beacons objectAtIndex:0];
        
        // calculate and set new y position
        switch (closestBeacon.ibeacon.proximity)
        {
            case CLProximityUnknown:
            self.distanceLabel = @"Unknown region";
            break;
            case CLProximityImmediate:
            self.distanceLabel = @"Immediate region";
            break;
            case CLProximityNear:
            self.distanceLabel = @"Near region";
            break;
            case CLProximityFar:
            self.distanceLabel = @"Far region";
            break;
            
            default:
            self.distanceLabel = @"CASE DEFAULT";
            break;
        }
    } else {
        self.distanceLabel = @"NO BEACONS";
    }

}


@end