#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"

@interface EstimoteBeacons () <ESTBeaconManagerDelegate,ESTBeaconDelegate>

@property (nonatomic, strong) ESTBeaconManager* beaconManager;
@property NSString* callbackId_startEstimoteBeaconsDiscoveryForRegion;

@end

@implementation EstimoteBeacons

#pragma mark - Initialization

- (EstimoteBeacons*)pluginInitialize
{
	NSLog(@"OBJC EstimoteBeacons pluginInitialize");

    // Crete beacon manager instance.
    self.beaconManager = [ESTBeaconManager new];
    self.beaconManager.delegate = self;
    // TODO: Uncomment: self.beaconManager.avoidUnknownStateBeacons = YES;

	self.callbackId_startEstimoteBeaconsDiscoveryForRegion = nil;

    // region watchers
	// TOD0: How is this used?
    self.regionWatchers = [[NSMutableDictionary alloc] init];

    return self;
}

#pragma mark - Helper methods

/**
 * Don't worry, the curly placement is just a joke ;-)
 */
- (ESTBeaconRegion*) createRegionFromDict: (NSDictionary*) regionDict {
	// Default values for the region object.
	NSUUID* uuid = ESTIMOTE_PROXIMITY_UUID;
	NSString* identifier = @"EstimoteSampleRegion";
	CLBeaconMajorValue major = 0;
	CLBeaconMinorValue minor = 0;
	BOOL majorIsDefined = NO;
	BOOL minorIsDefined = NO;

	// Get region values.
	for (id key in regionDict) {
		NSString* value = regionDict[key];
		if ([key isEqualToString:@"uuid"]) {
			uuid = [[NSUUID alloc] initWithUUIDString: value]; }
		else
		if ([key isEqualToString:@"id"]) {
			identifier = value; }
		else
		if ([key isEqualToString:@"major"]) {
			major = [value integerValue];
			majorIsDefined = YES; }
		else
		if ([key isEqualToString:@"minor"]) {
			minor = [value integerValue];
			minorIsDefined = YES; } }

	// Create a beacon region object.
	if (majorIsDefined && minorIsDefined) {
		return [[ESTBeaconRegion alloc]
			initWithProximityUUID: uuid
			major: major
			minor: minor
			identifier: identifier]; }
	else if (majorIsDefined) {
		return [[ESTBeaconRegion alloc]
			initWithProximityUUID: uuid
			major: major
			identifier:identifier];	}
	else {
		return [[ESTBeaconRegion alloc]
			initWithProximityUUID: uuid
			identifier: identifier]; } }

/**
 * Create a dictionary from a beacon object (used to pass
 * beacon data back to JavaScript).
 */
- (NSMutableDictionary*)beaconToDictionary:(ESTBeacon*)beacon
{
    NSMutableDictionary* props = [NSMutableDictionary dictionaryWithCapacity:32];

	// Properties always available.
    [props setValue:beacon.major forKey:@"major"];
    [props setValue:beacon.minor forKey:@"minor"];
    [props setValue:[NSNumber numberWithInteger:beacon.color] forKey:@"color"];
    [props setValue:[NSNumber numberWithInteger:beacon.rssi] forKey:@"rssi"];
    [props setValue:[NSNumber numberWithInteger:beacon.connectionStatus] forKey:@"connectionStatus"];

	// Properties available after CoreLocation based scan.
	[props setValue:beacon.proximityUUID.UUIDString forKey:@"proximityUUID"];
	[props setValue:beacon.distance forKey:@"distance"];
	[props setValue:[NSNumber numberWithInt:beacon.proximity] forKey:@"proximity"];

	// Properties available after CoreBluetooth based scan.
    [props setValue:beacon.macAddress forKey:@"macAddress"];
    [props setValue:beacon.measuredPower forKey:@"measuredPower"];
    [props setValue:[NSNumber numberWithInt:beacon.firmwareState] forKey:@"firmwareState"];

	// Properties available after connecting.
/*
      name property
      motionProximityUUID property
      power property
      advInterval property
      batteryLevel property
      remainingLifetime property
      batteryType property
      hardwareVersion property
      firmwareVersion property
      firmwareUpdateInfo property
      isMoving property
      isAccelerometerAvailable property
      isAccelerometerEditAvailable property
      accelerometerEnabled property
      basicPowerMode property
      smartPowerMode property

    [props setValue:beacon.batteryLevel forKey:@"batteryLevel"];
    [props setValue:beacon.firmwareVersion forKey:@"firmwareVersion"];
    [props setValue:beacon.hardwareVersion forKey:@"hardwareVersion"];
    [props setValue:major forKey:@"major"];
    [props setValue:minor forKey:@"minor"];
    [props setValue:beacon.advInterval forKey:@"advInterval"];
    [props setValue:beacon.description forKey:@"description"];
    [props setValue:beacon.debugDescription forKey:@"debugDescription"];
    [props setValue:[NSNumber numberWithBool:beacon.connectionStatus] forKey:@"connectionStatus"];
    [props setValue:[NSNumber numberWithChar:[beacon.power charValue]] forKey:@"power"];
*/

    return props;
}

#pragma mark - CoreBluetooth discovery

/**
 * Start CoreBluetooth discovery.
 */
- (void)startEstimoteBeaconsDiscoveryForRegion:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC startEstimoteBeaconsDiscoveryForRegion ");

	// Get region dictionary passed from JavaScript and
	// create a beacon region object.
    NSDictionary* regionDict = [command argumentAtIndex:0];
    ESTBeaconRegion* region = [self createRegionFromDict: regionDict];

    // Stop any ongoing discovery/ranging.
    [self stopEstimoteBeaconDiscovery: nil];
    //TODO: remove: [self.beaconManager stopRangingBeaconsInRegion: region];

	// Save callback id.
	self.callbackId_startEstimoteBeaconsDiscoveryForRegion = command.callbackId;

    // Start discovery.
    [self.beaconManager startEstimoteBeaconsDiscoveryForRegion:region];
}

/**
 * Stop CoreBluetooth discovery.
 */
- (void)stopEstimoteBeaconDiscovery:(CDVInvokedUrlCommand*)command
{
    // Stop existing discovery/ranging.
    [self.beaconManager stopEstimoteBeaconDiscovery];

	// Clear any existing callback.
	if (self.callbackId_startEstimoteBeaconsDiscoveryForRegion)
	{
		// Clear callback on the JS side.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_NO_RESULT];
		[result setKeepCallbackAsBool:NO];
		[self.commandDelegate
			sendPluginResult:result
			callbackId:self.callbackId_startEstimoteBeaconsDiscoveryForRegion];

		// Clear callback id.
		self.callbackId_startEstimoteBeaconsDiscoveryForRegion = nil;
	}

	// Respond to JavaScript with OK if there is a Cordova command object.
	if (command)
	{
    	[self.commandDelegate
			sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
			callbackId:command.callbackId];
	}
}

/**
 * CoreBluetooth discovery event.
 */
- (void)beaconManager:(ESTBeaconManager*)manager
	didDiscoverBeacons:(NSArray*)beacons
	inRegion:(ESTBeaconRegion*)region
{
	NSLog(@"OBJC didDiscoverBeacons %i", (int)[beacons count]);

	if ([beacons count] > 0)
	{
		NSMutableArray* beaconArray = [NSMutableArray array];

		// Convert beacons to a an array of property-value objects.
		for (ESTBeacon* beacon in beacons)
		{
			[beaconArray addObject:[self beaconToDictionary:beacon]];
		}

		// Pass result to JavaScript callback.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus: CDVCommandStatus_OK
			messageAsArray: beaconArray];
		[result setKeepCallbackAsBool: YES];
		[self.commandDelegate
			sendPluginResult: result
			callbackId: self.callbackId_startEstimoteBeaconsDiscoveryForRegion];
	}
}

/**
 * CoreBluetooth discovery error event.
 */
- (void)beaconManager:(ESTBeaconManager *)manager
	didFailDiscoveryInRegion:(ESTBeaconRegion *)region
{
	// Pass error to JavaScript.
    if (self.callbackId_startEstimoteBeaconsDiscoveryForRegion != nil)
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:@"didFailDiscoveryInRegion"]
			callbackId:self.callbackId_startEstimoteBeaconsDiscoveryForRegion];
    }
}

/*
Above code is tested using these snippets in Evothings Studio:

EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion(
    {},
    function(beacons){console.log('success ' + beacons[0].major + ' ' + beacons[0].minor)},
    function(){console.log('error')}
    )

EstimoteBeacons.stopEstimoteBeaconDiscovery(
    function(){console.log('success')},
    function(){console.log('error')}
    )

Use JavaScript tools to evaluate in Evothings Workbench.
Requires a Cordova app built with the plugin to test.
Make the app connect to the Workbench by entering
the Workbench ip-address/port as the Cordova main URL.
Example: http://192.168.0.101:4042
*/

// TODO: Rewrite methods below to use callbacks.

#pragma mark - Start monitoring methods

- (void)startRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command
{
    // stop existing discovery/ranging
    [self.beaconManager stopEstimoteBeaconDiscovery];
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];

    // start ranging
    [self.beaconManager startRangingBeaconsInRegion:self.currentRegion];

    // respond to JS with OK
    [self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

- (void)startMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
    NSString* regionid = [command argumentAtIndex:0];
    id major = [command argumentAtIndex:1];
    id minor = [command argumentAtIndex:2];
	BOOL notifyEntryStateOnDisplay = [[command argumentAtIndex:3] boolValue];

    if ([self.regionWatchers objectForKey:regionid] != nil)
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:@"Region with given ID is already monitored."]
			callbackId:command.callbackId];
    }
	else
	{
        ESTBeaconRegion* region;

        if ((NSNull*)major == [NSNull null] || (NSNull*)minor == [NSNull null])
		{
            region = [[ESTBeaconRegion alloc]
				initWithProximityUUID:ESTIMOTE_PROXIMITY_UUID
				identifier:regionid];

        }
		else
		{
            region = [[ESTBeaconRegion alloc]
				initWithProximityUUID:ESTIMOTE_PROXIMITY_UUID
				major:[major intValue]
				minor:[minor intValue]
				identifier:regionid];
        }

        region.notifyEntryStateOnDisplay = notifyEntryStateOnDisplay;

        [self.beaconManager startMonitoringForRegion:region];
        [self.beaconManager requestStateForRegion:region];

        [self.regionWatchers setObject:command.callbackId  forKey:regionid];
    }
}

#pragma mark - Stop monitoring methods

- (void)stopRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command
{
    // stop existing discovery/ranging
    [self.beaconManager stopRangingBeaconsInRegion:self.currentRegion];

    // respond to JS with OK
    [self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}


- (void)stopMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
    NSString* regionid = [command.arguments objectAtIndex:0];
    ESTBeaconRegion* regionFound = nil;

    for (ESTBeaconRegion* region in self.regionWatchers)
	{
        if ([region.identifier compare:regionid])
		{
            regionFound = region;
            break;
        }
    }

    if (regionFound != nil)
	{
        [self.beaconManager stopMonitoringForRegion:regionFound];

        [self.commandDelegate
			sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
			callbackId:command.callbackId];
    }
	else
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:@"Region with given ID not found."]
			callbackId:command.callbackId];
    }
}

#pragma mark - Get beacons methods

- (void)getBeacons:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:
	^{
        NSMutableArray* output = [NSMutableArray array];

        if ([self.beacons count] > 0)
        {
            //convert list of beacons to a an array of simple property-value objects
            for (id beacon in self.beacons)
			{
                [output addObject:[self beaconToDictionary:beacon]];
            }
        }

        CDVPluginResult* pluginResult = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK
			messageAsArray:output];

        [self.commandDelegate
			sendPluginResult:pluginResult
			callbackId:command.callbackId];
    }];
}

- (void)getBeaconByIdx:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSInteger idx = [[command.arguments objectAtIndex:0] intValue];

    if (idx < [self.beacons count] && idx >= 0)
	{
        pluginResult = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK
			messageAsDictionary:[self beaconToDictionary:[self.beacons objectAtIndex:idx]]];
    }
	else
	{
        pluginResult = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Invalid index."];
    }

    [self.commandDelegate
		sendPluginResult:pluginResult
		callbackId:command.callbackId];
}

- (void)getClosestBeacon:(CDVInvokedUrlCommand*)command
{
    if ([self.beacons count] > 0)
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_OK
				messageAsDictionary:[self beaconToDictionary:[self.beacons objectAtIndex:0]]]
			callbackId:command.callbackId];
    }
	else
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
			callbackId:command.callbackId];
    }
}

- (void)getConnectedBeacon:(CDVInvokedUrlCommand*)command
{
    if (self.connectedBeacon != nil)
	{
        [self.commandDelegate runInBackground:
		^{
            [self.commandDelegate
				sendPluginResult:[CDVPluginResult
					resultWithStatus:CDVCommandStatus_OK
					messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]]
				callbackId:command.callbackId];
        }];
    }
	else
	{
        // No connected beacons.
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:@"There are no connected beacons."]
			callbackId:command.callbackId];
    }
}

#pragma mark - Virtual Beacon methods

- (void)startVirtualBeacon:(CDVInvokedUrlCommand*)command
{
    NSInteger major = [[command argumentAtIndex:0] intValue];
    NSInteger minor = [[command argumentAtIndex:1] intValue];
    NSString* beaconId = [[command argumentAtIndex:2] stringValue];

    [self.beaconManager
		startAdvertisingWithProximityUUID:ESTIMOTE_PROXIMITY_UUID
		major:major
		minor:minor
		identifier:beaconId];

    [self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

- (void)stopVirtualBeacon:(CDVInvokedUrlCommand*)command
{
    [self.beaconManager stopAdvertising];

    [self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

#pragma mark - Connect to methods

// TODO: Rewrite to detect beacon from scanning.
- (void)connectToBeacon:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
    NSInteger major = [[command argumentAtIndex:0] intValue];
    NSInteger minor = [[command argumentAtIndex:1] intValue];
    ESTBeacon* foundBeacon = nil;

    if ([self.beacons count] > 0)
    {
        // Convert list of beacons to an array of simple property-value objects.
        for (id beacon in self.beacons)
		{
            ESTBeacon* currentBeacon = beacon;
            NSNumber* currentMajor = currentBeacon.major;
            NSNumber* currentMinor = currentBeacon.minor;

            if (currentMajor == nil)
			{
                currentMajor = currentBeacon.major;
            }
            if(currentMinor == nil)
			{
                currentMinor = currentBeacon.minor;
            }
            if (currentMajor == nil || currentMajor == nil)
			{
                continue;
            }

            if (minor == [currentMinor intValue] && major == [currentMajor intValue])
			{
                foundBeacon = beacon;
				break;
            }
        }
    }

    if (foundBeacon)
	{
        if ([foundBeacon isConnected])
		{
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
*/
}

- (void)connectToBeaconByMacAddress:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
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
*/
}

#pragma mark - Disconnect from Beacon

- (void)disconnectFromBeacon:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
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
*/
}

#pragma mark - Change attributes of beacon

- (void)setAdvIntervalOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{

	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
    if(self.connectedBeacon != nil) {
        NSNumber* advInterval = [command.arguments objectAtIndex:0];

        if(advInterval != nil && [advInterval intValue] >= 80 && [advInterval intValue] <= 3200) {


            [self.connectedBeacon writeBeaconAdvInterval:[advInterval shortValue] withCompletion:^(unsigned short value, NSError *error) {
                if(error != nil) {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription] callbackId:command.callbackId];
                } else {
                    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                         messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]] callbackId:command.callbackId];
                }

            }];

        } else {
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid advInterval value."] callbackId:command.callbackId];
        }
    } else {
        //no connected beacons
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"There are no connected beacons."] callbackId:command.callbackId];
    }
*/
}

- (void)setPowerOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{

	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
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
            [self.connectedBeacon writeBeaconPower:powerLevel withCompletion:^(ESTBeaconPower value, NSError *error) {
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
*/
}

- (void)updateFirmwareOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
    if (self.connectedBeacon != nil)
	{
        [self.connectedBeacon
			updateFirmwareWithProgress:^(NSInteger value, NSString* description, NSError *error)
			{
            	if (error == nil)
				{
                	self.firmwareUpdateProgress = description;
            	}
        	}
			completion:^(NSError *error)
			{
            	if (error == nil)
				{
                	[self.commandDelegate
						sendPluginResult:[CDVPluginResult
							resultWithStatus:CDVCommandStatus_OK
                        	messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]]
						callbackId:command.callbackId];
            	}
				else
				{
                	[self.commandDelegate
						sendPluginResult:[CDVPluginResult
							resultWithStatus:CDVCommandStatus_ERROR
							messageAsString:error.localizedDescription]
						callbackId:command.callbackId];
            	}

            	self.firmwareUpdateProgress = nil;
        	}];
    }
	else
	{
        // No beacons connected.
        [self.commandDelegate
			sendPluginResult: [CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:@"There are no connected beacons."]
			callbackId:command.callbackId];
    }
*/
}

- (void)getFirmwareUpdateProgress:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
/*
    if(self.firmwareUpdateProgress != nil) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                                 messageAsString:self.firmwareUpdateProgress] callbackId:command.callbackId];
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No beacon is being updated right now."] callbackId:command.callbackId];
    }
*/
}

#pragma mark - Beacon Manager delegate methods.

-(void)beaconManager:(ESTBeaconManager *)manager
     didRangeBeacons:(NSArray *)beacons
            inRegion:(ESTBeaconRegion *)region
{
    self.beacons = beacons;
}

- (void)beaconConnectionDidFail:(ESTBeacon *)beacon withError:(NSError *)error
{
    if (self.connectionCallbackId != nil)
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString:error.localizedDescription]
			callbackId:self.connectionCallbackId];
    }

    self.connectionCallbackId = nil;
    self.connectedBeacon = nil;
}

- (void)beaconConnectionDidSucceeded:(ESTBeacon *)beacon
{
    if (self.connectionCallbackId != nil)
	{
        [self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_OK
				messageAsDictionary:[self beaconToDictionary:self.connectedBeacon]]
			callbackId:self.connectionCallbackId];
    }

    self.connectionCallbackId = nil;
}

- (void)beaconDidDisconnectWithError:(NSError*)error
{
    if (self.connectionCallbackId == nil)
	{
        self.connectedBeacon = nil;
    }
}

- (void)beaconManager:(ESTBeaconManager *)manager
	didDetermineState:(CLRegionState)state
	forRegion:(ESTBeaconRegion *)region
{
    NSString *result = nil;

    switch (state)
	{
        case CLRegionStateUnknown:
            result = @"unknown";
            break;
        case CLRegionStateInside:
            result = @"enter";
            break;
        case CLRegionStateOutside:
            result = @"exit";
            break;
        default:
            result = @"unknown";
    }

    NSString* callbackId = [self.regionWatchers objectForKey:region.identifier];

    if (callbackId != nil)
	{
        NSMutableDictionary* props = [NSMutableDictionary dictionaryWithCapacity:4];

        [props setValue:region.identifier forKey:@"id"];
        [props setValue:region.major forKey:@"major"];
        [props setValue:region.minor forKey:@"minor"];
        [props setValue:result forKey:@"action"];

        CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK messageAsDictionary:props];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];

        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }
}

@end
