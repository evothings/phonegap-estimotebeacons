#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"
#import "ESTBeaconManager.h"

@interface EstimoteBeacons () <ESTBeaconManagerDelegate,ESTBeaconDelegate>

@property (nonatomic, strong) ESTBeaconManager* beaconManager;


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
    
    // region watchers
    self.regionWatchers = [[NSMutableDictionary alloc] init];
    
    return self;
}

#pragma mark - Start monitoring methods

- (void)startEstimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];
    
    // start discovery
    [self.beaconManager startEstimoteBeaconsDiscoveryForRegion:self.currentRegion];
    
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

- (void)startMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
    NSString* regionid = [command.arguments objectAtIndex:0];
    id major = [command.arguments objectAtIndex:1];
    id minor = [command.arguments objectAtIndex:2];
    
    if([self.regionWatchers objectForKey:regionid] != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Region with given ID is already monitored."] callbackId:command.callbackId];
    } else {
        ESTBeaconRegion* region;
        
        if((NSNull *)major == [NSNull null] || (NSNull *)minor == [NSNull null]) {
            region = [[ESTBeaconRegion alloc] initRegionWithIdentifier:regionid];
        } else {
            region = [[ESTBeaconRegion alloc] initRegionWithMajor:[major intValue] minor:[minor intValue] identifier:regionid];
        }
        
        [self.beaconManager startMonitoringForRegion:region];
        [self.beaconManager requestStateForRegion:region];
        
        [self.regionWatchers setObject:command.callbackId  forKey:regionid];
    }
}

#pragma mark - Stop monitoring methods

- (void)stopEsimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)stopRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command {
    // stop existing discovery/ranging
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];
    
    // respond to JS with OK
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}


- (void)stopMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
    NSString* regionid = [command.arguments objectAtIndex:0];
    ESTBeaconRegion* regionFound = nil;
    
    //    for(ESTBeaconRegion* region in self.regionWatchers) {
    //        if([region.identifier compare:regionid]) {
    //            regionFound = region;
    //            break;
    //        }
    //    }
    //
    //    if(regionFound != nil) {
    //        [self.beaconManager stopMonitoringForRegion:regionFound];
    //
    //        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
    //    } else {
    //        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Region with given ID not found."] callbackId:command.callbackId];
    //    }
}

#pragma mark - Get beacons methods
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
        [self.commandDelegate runInBackground:^{
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                 messageAsDictionary:[self beaconToDictionary:[self.beacons objectAtIndex:0]]]
                                        callbackId:command.callbackId];
        }];
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
    }
}

- (void)getConnectedBeacon:(CDVInvokedUrlCommand*)command
{
    if(self.connectedBeacon != nil) {
        [self.commandDelegate runInBackground:^{
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                 messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]] callbackId:command.callbackId];
        }];
    } else {
        //no connected beacons
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."] callbackId:command.callbackId];
    }
}
#pragma mark - Virtual Beacon methods

- (void)startVirtualBeacon:(CDVInvokedUrlCommand*)command
{
    NSInteger major = [[command.arguments objectAtIndex:0] intValue];
    NSInteger minor = [[command.arguments objectAtIndex:1] intValue];
    NSString* beaconid = [command.arguments objectAtIndex:2];
    
    [self.beaconManager startAdvertisingWithMajor:major withMinor:minor withIdentifier:beaconid];
    
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void)stopVirtualBeacon:(CDVInvokedUrlCommand*)command
{
    [self.beaconManager stopAdvertising];
    
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

#pragma mark - Connecto to methods
- (void)connectToBeacon:(CDVInvokedUrlCommand*)command
{
    NSInteger major = [[command.arguments objectAtIndex:0] intValue];
    NSInteger minor = [[command.arguments objectAtIndex:1] intValue];
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
            
            if(minor == [currentMinor intValue] && major == [currentMajor intValue]) {
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

- (void)connectToBeaconByMacAddress:(CDVInvokedUrlCommand*)command
{
    NSString* macAddress = [command.arguments objectAtIndex:0];
    ESTBeacon* foundBeacon = nil;
    
    if([self.beacons count] > 0)
    {
        //convert list of beacons to a an array of simple property-value objects
        for (id beacon in self.beacons) {
            ESTBeacon* currentBeacon = beacon;
            NSString* currentMac = currentBeacon.macAddress;
            
            if(currentMac == nil) {
                continue;
            }
            
            if([currentMac isEqualToString:macAddress]) {
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

#pragma mark - Disconnect from Beacon
- (void)disconnectFromBeacon:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
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
    }];
}

#pragma mark - Change attributes of beacon
- (void)setFrequencyOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{
    if(self.connectedBeacon != nil) {
        NSNumber* frequency = [command.arguments objectAtIndex:0];
        
        if(frequency != nil && [frequency intValue] >= 80 && [frequency intValue] <= 3200) {
            [self.connectedBeacon writeBeaconFrequency:[frequency shortValue] withCompletion:^(unsigned int value, NSError *error){
                if(error != nil) {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription] callbackId:command.callbackId];
                } else {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                         messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]] callbackId:command.callbackId];
                }
                
            }];
            
        } else {
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid frequency value."] callbackId:command.callbackId];
        }
    } else {
        //no connected beacons
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."] callbackId:command.callbackId];
    }
}

- (void)setPowerOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{
    if(self.connectedBeacon != nil) {
        NSNumber* power = [command.arguments objectAtIndex:0];
        ESTBeaconPower powerLevel;
        
        switch ([power intValue]) {
            case -40:
                powerLevel = ESTBeaconPowerLevel1;
                break;
            case -20:
                powerLevel = ESTBeaconPowerLevel2;
                break;
            case -16:
                powerLevel = ESTBeaconPowerLevel3;
                break;
            case -12:
                powerLevel = ESTBeaconPowerLevel4;
                break;
            case -8:
                powerLevel = ESTBeaconPowerLevel5;
                break;
            case -4:
                powerLevel = ESTBeaconPowerLevel6;
                break;
            case 0:
                powerLevel = ESTBeaconPowerLevel7;
                break;
            case 4:
                powerLevel = ESTBeaconPowerLevel8;
                break;
        }
        
        if(powerLevel || powerLevel == ESTBeaconPowerLevel7) {
            [self.connectedBeacon writeBeaconPower:powerLevel withCompletion:^(unsigned int value, NSError *error){
                if(error != nil) {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription] callbackId:command.callbackId];
                } else {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                         messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]] callbackId:command.callbackId];
                }
            }];
        } else {
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid power value."] callbackId:command.callbackId];
        }
    } else {
        //no connected beacons
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."] callbackId:command.callbackId];
    }
}

- (void)updateFirmwareOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{
    if(self.connectedBeacon != nil) {
        [self.connectedBeacon updateBeaconFirmwareWithProgress:^(NSString *value, NSError *error){
            if(error == nil) {
                self.firmwareUpdateProgress = value;
            }
            
        }andCompletion:^(NSError *error){
            if(error == nil) {
                [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                     messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]] callbackId:command.callbackId];
            } else {
                [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription] callbackId:command.callbackId];
            }
            
            self.firmwareUpdateProgress = nil;
        }];
    } else {
        //no connected beacons
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."] callbackId:command.callbackId];
    }
}

- (void)getFirmwareUpdateProgress:(CDVInvokedUrlCommand*)command
{
    if(self.firmwareUpdateProgress != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                 messageAsString:self.firmwareUpdateProgress] callbackId:command.callbackId];
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No beacon is being updated right now."] callbackId:command.callbackId];
    }
}

#pragma mark - Helpers

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
    
    [props setValue:beacon.batteryLevel forKey:@"batteryLevel"];
    [props setValue:beacon.firmwareVersion forKey:@"firmwareVersion"];
    [props setValue:beacon.hardwareVersion forKey:@"hardwareVersion"];
    [props setValue:major forKey:@"major"];
    [props setValue:minor forKey:@"minor"];
    [props setValue:beacon.frequency forKey:@"frequency"];
    [props setValue:beacon.description forKey:@"description"];
    [props setValue:rssi forKey:@"rssi"];
    [props setValue:beacon.debugDescription forKey:@"debugDescription"];
    [props setValue:beacon.macAddress forKey:@"macAddress"];
    [props setValue:beacon.measuredPower forKey:@"measuredPower"];
    [props setValue:[NSNumber numberWithBool:beacon.isConnected] forKey:@"isConnected"];
    
    if(beacon.power != nil) {
        [props setValue:[NSNumber numberWithChar:[beacon.power charValue]] forKey:@"power"];
    }
    
    if(beacon.ibeacon != nil) {
        [props setValue:[NSNumber numberWithDouble:beacon.ibeacon.accuracy] forKey:@"accuracy"];
        [props setValue:[NSNumber numberWithInt:beacon.ibeacon.proximity] forKey:@"proximity"];
        
        if(beacon.ibeacon.proximityUUID != nil) {
            [props setValue:beacon.ibeacon.proximityUUID.UUIDString forKey:@"proximityUUID"];
        }
    }
    
    
    return props;
}

#pragma mark - Beacon Manager delegate methods.

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

- (void)beaconConnectionDidFail:(ESTBeacon *)beacon withError:(NSError *)error {
    if(self.connectionCallbackId != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                                 messageAsString:error.localizedDescription]
                                    callbackId:self.connectionCallbackId];
    }
    
    self.connectionCallbackId = nil;
    self.connectedBeacon = nil;
}

- (void)beaconConnectionDidSucceeded:(ESTBeacon *)beacon {
    if(self.connectionCallbackId != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                             messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]]
                                    callbackId:self.connectionCallbackId];
    }
    
    self.connectionCallbackId = nil;
}

- (void)beaconDidDisconnectWithError:(NSError*)error {
    if(self.connectionCallbackId == nil) {
        self.connectedBeacon = nil;
    }
}

-(void)beaconManager:(ESTBeaconManager *)manager
      didEnterRegion:(ESTBeaconRegion *)region
{
    NSString* callbackId = [self.regionWatchers objectForKey:region.identifier];
    
    if(callbackId != nil) {
        NSMutableDictionary* props = [NSMutableDictionary dictionaryWithCapacity:4];
        
        [props setValue:region.identifier forKey:@"id"];
        [props setValue:region.major forKey:@"major"];
        [props setValue:region.minor forKey:@"minor"];
        [props setValue:@"enter" forKey:@"action"];
        
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:props];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

-(void)beaconManager:(ESTBeaconManager *)manager
       didExitRegion:(ESTBeaconRegion *)region
{
    NSString* callbackId = [self.regionWatchers objectForKey:region.identifier];
    
    if(callbackId != nil) {
        NSMutableDictionary* props = [NSMutableDictionary dictionaryWithCapacity:4];
        
        [props setValue:region.identifier forKey:@"id"];
        [props setValue:region.major forKey:@"major"];
        [props setValue:region.minor forKey:@"minor"];
        [props setValue:@"exit" forKey:@"action"];
        
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:props];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

@end