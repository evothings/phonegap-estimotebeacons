#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"
#import "ESTBeaconManager.h"

@interface EstimoteBeacons () <ESTBeaconManagerDelegate>

@property (nonatomic, strong) ESTBeaconManager* beaconManager;

@end

@interface EstimoteBeacons () <ESTBeaconDelegate>

@property (nonatomic, strong) ESTBeacon* closestBeacon;

@end

@implementation EstimoteBeacons

- (EstimoteBeacons*)pluginInitialize
{
    // craete manager instance
    self.beaconManager = [[ESTBeaconManager alloc] init];
    self.beaconManager.delegate = self;
    self.beaconManager.avoidUnknownStateBeacons = YES;
    
    // create sample region object (you can additionaly pass major / minor values)
    self.currentRegion = [[ESTBeaconRegion alloc] initRegionWithIdentifier:@"EstimoteSampleRegion"];
    
    return self;
}


- (void)startEstimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];
    
    // start discovery
    [self.beaconManager startEstimoteBeaconsDiscoveryForRegion:self.currentRegion];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)stopEsimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)startRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];
    
    // start ranging
    [self.beaconManager startRangingBeaconsInRegion:self.currentRegion];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)stopRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)getBeacons:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSMutableArray* output = [NSMutableArray array];
        
        if([self.beacons count] > 0)
        {
            //convert list of beacons to a an array of simple property-value objects
            for (id beacon in self.beacons) {
                [output addObject:[self beaconToDictionary:beacon]];
            }
        }
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:output];
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getBeaconByIdx:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSInteger idx = [[command.arguments objectAtIndex:0] intValue];
    
    if (idx < [self.beacons count] && idx >= 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsDictionary:[self beaconToDictionary:[self.beacons objectAtIndex:idx]]];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid index."];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getClosestBeacon:(CDVInvokedUrlCommand*)command
{
    if ([self.beacons count] > 0) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                             messageAsDictionary:[self beaconToDictionary:[self.beacons objectAtIndex:0]]]
                                    callbackId:command.callbackId];
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
    }
}

- (void)connectToBeacon:(CDVInvokedUrlCommand*)command
{
    NSNumber* major = [NSNumber numberWithInt: [[command.arguments objectAtIndex:0] intValue]];
    NSNumber* minor = [NSNumber numberWithInt: [[command.arguments objectAtIndex:1] intValue]];
    ESTBeacon* foundBeacon = nil;
    
    if([self.beacons count] > 0)
    {
        //convert list of beacons to a an array of simple property-value objects
        for (id beacon in self.beacons) {
            ESTBeacon* currentBeacon = beacon;
            NSNumber* currentMajor = currentBeacon.major;
            NSNumber* currentMinor = currentBeacon.minor;
            
            if(currentMajor == nil) {
                currentMajor = currentBeacon.ibeacon.major;
            }
            if(currentMinor == nil) {
                currentMinor = currentBeacon.ibeacon.minor;
            }
            
            if(currentMajor == nil || currentMajor == nil) {
                continue;
            }
            
            if([minor compare:currentMinor] == 0 && [major compare:currentMajor] == 0) {
                foundBeacon = beacon;
            }
        }
    }
    
    if(foundBeacon) {
        if([foundBeacon isConnected]) {
            //beacon is already connected
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Beacon is already connected."] callbackId:command.callbackId];
        } else if(self.connectionCallbackId != nil) {
            //some callback is already waiting for connection
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"App is already waiting for connection."] callbackId:command.callbackId];
        } else {
            //everything OK - try connecting
            self.connectionCallbackId = command.callbackId;
            self.connectedBeacon = foundBeacon;
            foundBeacon.delegate = self;
            [foundBeacon connectToBeacon];
        }
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Beacon not found."] callbackId:command.callbackId];
    }
}

- (void)disconnectFromBeacon:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    
    if(self.connectedBeacon != nil) {
        [self.connectedBeacon disconnectBeacon];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                     messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]];
        
        self.connectedBeacon = nil;
    } else {
        //no connected beacons
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// HELPERS

- (NSMutableDictionary*)beaconToDictionary:(ESTBeacon*)beacon
{
    NSMutableDictionary* props = [NSMutableDictionary dictionaryWithCapacity:16];
    NSNumber* major = beacon.major;
    NSNumber* minor = beacon.minor;
    NSNumber* rssi = beacon.rssi;
    
    if(major == nil) {
        major = beacon.ibeacon.major;
    }
    if(minor == nil) {
        minor = beacon.ibeacon.minor;
    }
    if(rssi == nil) {
        rssi = [NSNumber numberWithInt:beacon.ibeacon.rssi];
    }
    
    [props setValue:beacon.baterryLevel forKey:@"baterryLevel"];
    [props setValue:beacon.firmwareVersion forKey:@"firmwareVersion"];
    [props setValue:beacon.hardwareVersion forKey:@"hardwareVersion"];
    [props setValue:major forKey:@"major"];
    [props setValue:minor forKey:@"minor"];
    [props setValue:beacon.power forKey:@"power"];
    [props setValue:beacon.frequency forKey:@"frequency"];
    [props setValue:beacon.description forKey:@"description"];
    [props setValue:rssi forKey:@"rssi"];
    [props setValue:[NSNumber numberWithDouble:beacon.ibeacon.accuracy] forKey:@"accuracy"];
    [props setValue:[NSNumber numberWithInt:beacon.ibeacon.proximity] forKey:@"proximity"];
    [props setValue:beacon.ibeacon.proximityUUID.UUIDString forKey:@"proximityUUID"];
    [props setValue:beacon.debugDescription forKey:@"debugDescription"];
    [props setValue:beacon.macAddress forKey:@"macAddress"];
    [props setValue:beacon.measuredPower forKey:@"measuredPower"];
    [props setValue:[NSNumber numberWithBool:beacon.isConnected] forKey:@"isConnected"];
    
    return props;
}

// STRANGE CALLBACK-LIKE STUFF

- (void)beaconManager:(ESTBeaconManager *)manager
   didDiscoverBeacons:(NSArray *)beacons
             inRegion:(ESTBeaconRegion *)region
{
    self.beacons = beacons;
}

-(void)beaconManager:(ESTBeaconManager *)manager
     didRangeBeacons:(NSArray *)beacons
            inRegion:(ESTBeaconRegion *)region
{
    self.beacons = beacons;
}

- (void)beaconConnectionDidFail:(NSError*)error {
    if(self.connectionCallbackId != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                                 messageAsString:error.localizedDescription]
                                    callbackId:self.connectionCallbackId];
        
    }
    
    self.connectionCallbackId = nil;
    self.connectedBeacon = nil;
}

- (void)beaconConnectionDidSucceeded {
    if(self.connectionCallbackId != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                             messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]]
                                    callbackId:self.connectionCallbackId];
        
    }
    
    self.connectionCallbackId = nil;
    //    [self.closestBeacon updateBeaconFirmwareWithProgress:^(NSString *value, NSError *error) {
    //    } andCompletition:^(NSError *error) {
    //    }];
}

- (void)beaconDidDisconnectWithError:(NSError*)error {
}

@end