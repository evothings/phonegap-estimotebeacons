#import <Cordova/CDV.h>
#import "EstimoteBeacons.h"

@interface EstimoteBeacons () <ESTBeaconManagerDelegate,ESTBeaconDelegate>

/*
TODO: Remove.
@property NSArray *beacons;
@property ESTBeaconRegion* currentRegion;
@property NSString* connectionCallbackId;
@property NSString* firmwareUpdateProgress;
@property ESTBeacon* connectedBeacon;
*/

/**
 * The beacon manager in the Estimote API.
 */
@property (nonatomic, strong) ESTBeaconManager* beaconManager;

/**
 * Callback id for startEstimoteBeaconsDiscoveryForRegion.
 */
@property NSString* callbackId_startEstimoteBeaconsDiscoveryForRegion;

/**
 * Dictionary of callback ids for startRangingBeaconsInRegion.
 * Region identifiers are used as keys.
 */
@property NSMutableDictionary* callbackIds_startRangingBeaconsInRegion;

/**
 * Dictionary of callback ids for startRangingBeaconsInRegion.
 * Region identifiers are used as keys.
 */
@property NSMutableDictionary* callbackIds_startMonitoringForRegion;

@end

@implementation EstimoteBeacons

#pragma mark - Initialization

- (EstimoteBeacons*)pluginInitialize
{
	NSLog(@"OBJC EstimoteBeacons pluginInitialize");

	// Crete beacon manager instance.
	self.beaconManager = [ESTBeaconManager new];
	self.beaconManager.delegate = self;

	// This will skip beacons with proximity CLProximityUnknown when ranging.
	self.beaconManager.avoidUnknownStateBeacons = YES;

	// Variables that track callback ids.
	self.callbackId_startEstimoteBeaconsDiscoveryForRegion = nil;
	self.callbackIds_startRangingBeaconsInRegion = [NSMutableDictionary new];
	self.callbackIds_startMonitoringForRegion = [NSMutableDictionary new];

	return self;
}

/**
 * From interface CDVPlugin.
 * Called when the WebView navigates or refreshes.
 */
- (void) onReset
{
	// Reset callback variables.
	self.callbackId_startEstimoteBeaconsDiscoveryForRegion = nil;
	self.callbackIds_startRangingBeaconsInRegion = [NSMutableDictionary new];
	self.callbackIds_startMonitoringForRegion = [NSMutableDictionary new];

	// Stop any ongoing scanning.
	[self.beaconManager stopEstimoteBeaconDiscovery];

	// TODO: Stop any ongiong ranging or monitoring.
}

#pragma mark - Helper methods

/**
 * Create a region object from a dictionary.
 * Don't worry, the curly placement is just a joke ;-)
 */
- (ESTBeaconRegion*) createRegionFromDictionary:(NSDictionary*)regionDict {
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
		if ([key isEqualToString:@"identifier"]) {
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
 * Create a dictionary object from a region.
 */
- (NSDictionary*)regionToDictionary:(ESTBeaconRegion*)region
{
	NSMutableDictionary* dict = [NSMutableDictionary dictionaryWithCapacity:4];

	[dict setValue:region.proximityUUID.UUIDString forKey:@"uuid"];
	[dict setValue:region.identifier forKey:@"identifier"];
	[dict setValue:region.major forKey:@"major"];
	[dict setValue:region.minor forKey:@"minor"];

	return dict;
}

/**
 * Create a dictionary key for a region.
 */
- (NSString*)regionDictionaryKey:(ESTBeaconRegion*)region
{
	NSString* uuid = region.proximityUUID.UUIDString;
	int major = nil != region.major ? [region.major intValue] : 0;
	int minor = nil != region.minor ? [region.minor intValue] : 0;

	return [NSString stringWithFormat: @"%@-%i-%i", uuid, major, minor];
}

/**
 * Create a dictionary from a beacon object (used to
 * pass beacon data back to JavaScript).
 */
- (NSDictionary*)beaconToDictionary:(ESTBeacon*)beacon
{
	NSMutableDictionary* dict = [NSMutableDictionary dictionaryWithCapacity:32];

	// Properties always available.
	[dict setValue:beacon.major forKey:@"major"];
	[dict setValue:beacon.minor forKey:@"minor"];
	[dict setValue:[NSNumber numberWithInteger:beacon.color] forKey:@"color"];
	[dict setValue:[NSNumber numberWithInteger:beacon.rssi] forKey:@"rssi"];
	[dict setValue:[NSNumber numberWithInteger:beacon.connectionStatus] forKey:@"connectionStatus"];

	// Properties available after CoreLocation based scan.
	[dict setValue:beacon.proximityUUID.UUIDString forKey:@"proximityUUID"]; // TODO: Check nil value?
	[dict setValue:beacon.distance forKey:@"distance"];
	[dict setValue:[NSNumber numberWithInt:beacon.proximity] forKey:@"proximity"];

	// Properties available after CoreBluetooth based scan.
	[dict setValue:beacon.macAddress forKey:@"macAddress"];
	[dict setValue:beacon.measuredPower forKey:@"measuredPower"];
	[dict setValue:[NSNumber numberWithInt:beacon.firmwareState] forKey:@"firmwareState"];

	// Properties available after connecting.
	if (ESTConnectionStatusConnected == beacon.connectionStatus) {
		[dict setValue:beacon.name forKey:@"name"];
		[dict setValue:beacon.motionProximityUUID.UUIDString forKey:@"name"]; // TODO: Check nil value?
		[dict setValue:[NSNumber numberWithChar:[beacon.power charValue]] forKey:@"power"];
		[dict setValue:beacon.advInterval forKey:@"advInterval"];
		[dict setValue:beacon.batteryLevel forKey:@"batteryLevel"];
		[dict setValue:beacon.remainingLifetime forKey:@"remainingLifetime"];
		[dict setValue:[NSNumber numberWithInt:beacon.batteryType] forKey:@"batteryType"];
		[dict setValue:beacon.hardwareVersion forKey:@"hardwareVersion"];
		[dict setValue:beacon.firmwareVersion forKey:@"firmwareVersion"];
		[dict setValue:[NSNumber numberWithInt:beacon.firmwareUpdateInfo] forKey:@"firmwareUpdateInfo"];
		[dict setValue:[NSNumber numberWithBool:beacon.isMoving] forKey:@"isMoving"];
		[dict setValue:[NSNumber numberWithBool:beacon.isAccelerometerAvailable] forKey:@"isAccelerometerAvailable"];
		[dict setValue:[NSNumber numberWithBool:beacon.isAccelerometerEditAvailable] forKey:@"isAccelerometerEditAvailable"];
		[dict setValue:[NSNumber numberWithBool:beacon.accelerometerEnabled] forKey:@"accelerometerEnabled"];
		[dict setValue:[NSNumber numberWithInt:beacon.basicPowerMode] forKey:@"basicPowerMode"];
		[dict setValue:[NSNumber numberWithInt:beacon.smartPowerMode] forKey:@"smartPowerMode"];
	}

	return dict;
}

/**
 * Create a dictionary object from a region.
 */
- (NSDictionary*)dictionaryWithRegion:(ESTBeaconRegion*)region
	andBeacons:(NSArray*)beacons
{
	// Convert beacons to a an array of property-value objects.
	NSMutableArray* beaconArray = [NSMutableArray array];
	for (ESTBeacon* beacon in beacons)
	{
		[beaconArray addObject:[self beaconToDictionary:beacon]];
	}

	NSDictionary* regionDictionary = [self regionToDictionary:region];

	return @{
		@"region" : regionDictionary,
		@"beacons" : beaconArray
		};
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
	NSDictionary* regionDictionary = [command argumentAtIndex:0];
	ESTBeaconRegion* region = [self createRegionFromDictionary:regionDictionary];

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
	// Stop discovery.
	[self helper_stopEstimoteBeaconDiscovery];

	// Respond to JavaScript with OK if a Cordova command object was passed.
	if (nil != command)
	{
		[self.commandDelegate
			sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
			callbackId:command.callbackId];
	}
}

- (void) helper_stopEstimoteBeaconDiscovery
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
}

/**
 * CoreBluetooth discovery event.
 */
- (void)beaconManager:(ESTBeaconManager*)manager
	didDiscoverBeacons:(NSArray*)beacons
	inRegion:(ESTBeaconRegion*)region
{
	if ([beacons count] > 0
		&& nil != self.callbackId_startEstimoteBeaconsDiscoveryForRegion)
	{
		// Create dictionary with result.
		NSDictionary* resultDictionary = [self
			dictionaryWithRegion:region
			andBeacons:beacons];

		// Pass result to JavaScript callback.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK
			messageAsDictionary:resultDictionary];
		[result setKeepCallbackAsBool: YES];
		[self.commandDelegate
			sendPluginResult:result
			callbackId:self.callbackId_startEstimoteBeaconsDiscoveryForRegion];
	}
}

/**
 * CoreBluetooth discovery error event.
 */
- (void)beaconManager:(ESTBeaconManager*)manager
	didFailDiscoveryInRegion:(ESTBeaconRegion*)region
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

#pragma mark - CoreLocation ranging

/**
 * Start CoreLocation ranging.
 */
- (void)startRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC startRangingBeaconsInRegion");

	// Get region dictionary passed from JavaScript and
	// create a beacon region object.
	NSDictionary* regionDictionary = [command argumentAtIndex:0];
	ESTBeaconRegion* region = [self createRegionFromDictionary:regionDictionary];

	// Stop any ongoing ranging for the given region.
	[self helper_stopRangingBeaconsInRegion:region];

	// Save callback id for the region.
	[self.callbackIds_startRangingBeaconsInRegion
		setObject:command.callbackId
		forKey:[self regionDictionaryKey:region]];

	// Start ranging.
	[self.beaconManager startRangingBeaconsInRegion:region];
}

/**
 * Stop CoreLocation ranging.
 */
- (void)stopRangingBeaconsInRegion:(CDVInvokedUrlCommand*)command
{
	// Get region dictionary passed from JavaScript and
	// create a beacon region object.
	NSDictionary* regionDictionary = [command argumentAtIndex:0];
	ESTBeaconRegion* region = [self createRegionFromDictionary:regionDictionary];

	// Stop ranging.
	[self helper_stopRangingBeaconsInRegion:region];

	// Respond to JavaScript with OK.
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

- (void)helper_stopRangingBeaconsInRegion:(ESTBeaconRegion*)region
{
	// Stop ranging the region.
	[self.beaconManager stopRangingBeaconsInRegion:region];

	// Clear any existing callback.
	NSString* callbackId = [self.callbackIds_startRangingBeaconsInRegion
		objectForKey:[self regionDictionaryKey:region]];
	if (nil != callbackId)
	{
		// Clear callback on the JS side.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_NO_RESULT];
		[result setKeepCallbackAsBool:NO];
		[self.commandDelegate
			sendPluginResult:result
			callbackId:callbackId];

		// Clear callback id.
		[self.callbackIds_startRangingBeaconsInRegion
			removeObjectForKey:[self regionDictionaryKey:region]];
	}
}

/**
 * CoreLocation ranging event.
 */
- (void)beaconManager:(ESTBeaconManager*)manager
	didRangeBeacons:(NSArray*)beacons
	inRegion:(ESTBeaconRegion*)region
{
	if ([beacons count] > 0)
	{
		NSString* callbackId = [self.callbackIds_startRangingBeaconsInRegion
			objectForKey:[self regionDictionaryKey:region]];
		if (nil != callbackId)
		{
			// Create dictionary with result.
			NSDictionary* resultDictionary = [self
				dictionaryWithRegion:region
				andBeacons:beacons];

			// Pass result to JavaScript callback.
			CDVPluginResult* result = [CDVPluginResult
				resultWithStatus:CDVCommandStatus_OK
				messageAsDictionary:resultDictionary];
			[result setKeepCallbackAsBool: YES];
			[self.commandDelegate
				sendPluginResult:result
				callbackId:callbackId];
		}
	}
}

/**
 * CoreLocation ranging error event.
 */
- (void)beaconManager:(ESTBeaconManager*)manager
	rangingBeaconsDidFailForRegion:(ESTBeaconRegion*)region
	withError:(NSError*)error
{
	// Send error message before callback is cleared.
	NSString* callbackId = [self.callbackIds_startRangingBeaconsInRegion
		objectForKey:[self regionDictionaryKey:region]];
	if (nil != callbackId)
	{
		// Pass error to JavaScript.
		[self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString: error.localizedDescription]
			callbackId: callbackId];
	}

	// Stop ranging and clear callback.
	[self helper_stopRangingBeaconsInRegion:region];
}

#pragma mark - CoreLocation monitoring

/**
 * Start CoreLocation monitoring.
 */
- (void)startMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC startMonitoringForRegion");

	// Get region dictionary passed from JavaScript and
	// create a beacon region object.
	NSDictionary* regionDictionary = [command argumentAtIndex:0];
	ESTBeaconRegion* region = [self createRegionFromDictionary:regionDictionary];

	// Set region notification when display is activated.
	region.notifyEntryStateOnDisplay = (BOOL)[command argumentAtIndex:1];

	// Stop any ongoing monitoring for the given region.
	[self helper_stopMonitoringForRegion:region];

	// Save callback id for the region.
	[self.callbackIds_startMonitoringForRegion
		setObject:command.callbackId
		forKey:[self regionDictionaryKey:region]];

	// Start monitoring.
	[self.beaconManager startMonitoringForRegion:region];

	// This will get the initial state faster.
	[self.beaconManager requestStateForRegion:region];
}

/**
 * Stop CoreLocation monitoring.
 */
- (void)stopMonitoringForRegion:(CDVInvokedUrlCommand*)command
{
	// Get region dictionary passed from JavaScript and
	// create a beacon region object.
	NSDictionary* regionDictionary = [command argumentAtIndex:0];
	ESTBeaconRegion* region = [self createRegionFromDictionary:regionDictionary];

	// Stop monitoring.
	[self helper_stopMonitoringForRegion:region];

	// Respond to JavaScript with OK.
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

- (void)helper_stopMonitoringForRegion:(ESTBeaconRegion*)region
{
	// Stop monitoring the region.
	[self.beaconManager stopMonitoringForRegion:region];

	// Clear any existing callback.
	NSString* callbackId = [self.callbackIds_startMonitoringForRegion
		objectForKey:[self regionDictionaryKey:region]];
	if (nil != callbackId)
	{
		// Clear callback on the JS side.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_NO_RESULT];
		[result setKeepCallbackAsBool:NO];
		[self.commandDelegate
			sendPluginResult:result
			callbackId:callbackId];

		// Clear callback id.
		[self.callbackIds_startMonitoringForRegion
			removeObjectForKey:[self regionDictionaryKey:region]];
	}
}

- (void)beaconManager:(ESTBeaconManager *)manager
	didStartMonitoringForRegion:(ESTBeaconRegion *)region
{
	// Not used.
}

- (void)beaconManager:(ESTBeaconManager *)manager
	didEnterRegion:(ESTBeaconRegion *)region
{
	// Not used.
}

- (void)beaconManager:(ESTBeaconManager *)manager
	didExitRegion:(ESTBeaconRegion *)region
{
	// Not used.
}

/**
 * CoreLocation monitoring event.
 */
- (void)beaconManager:(ESTBeaconManager *)manager
	didDetermineState:(CLRegionState)state
	forRegion:(ESTBeaconRegion *)region
{
	NSLog(@"OBJC didDetermineStateforRegion");

	// Create state string.
	NSString* stateString;
	switch (state)
	{
		case CLRegionStateInside:
			stateString = @"inside";
			break;
		case CLRegionStateOutside:
			stateString = @"outside";
			break;
		case CLRegionStateUnknown:
		default:
			stateString = @"unknown";
	}

	// Send result to JavaScript.
	NSString* callbackId = [self.callbackIds_startMonitoringForRegion
		objectForKey:[self regionDictionaryKey:region]];
	if (nil != callbackId)
	{
		// Create result object.
		NSMutableDictionary* dict = [NSMutableDictionary dictionaryWithCapacity:8];
		[dict setValue:region.proximityUUID.UUIDString forKey:@"uuid"];
		[dict setValue:region.identifier forKey:@"identifier"];
		[dict setValue:region.major forKey:@"major"];
		[dict setValue:region.minor forKey:@"minor"];
		[dict setValue:stateString forKey:@"state"];

		// Send result.
		CDVPluginResult* result = [CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK
			messageAsDictionary:dict];
		[result setKeepCallback:[NSNumber numberWithBool:YES]];
		[self.commandDelegate sendPluginResult:result callbackId:callbackId];
	}
}

/**
 * CoreLocation monitoring error event.
 */
- (void)beaconManager:(ESTBeaconManager *)manager
	monitoringDidFailForRegion:(ESTBeaconRegion *)region
	withError:(NSError *)error
{
	// Send error message before callback is cleared.
	NSString* callbackId = [self.callbackIds_startMonitoringForRegion
		objectForKey:[self regionDictionaryKey:region]];
	if (nil != callbackId)
	{
		// Pass error to JavaScript.
		[self.commandDelegate
			sendPluginResult:[CDVPluginResult
				resultWithStatus:CDVCommandStatus_ERROR
				messageAsString: error.localizedDescription]
			callbackId: callbackId];
	}

	// Stop monitoring and clear callback.
	[self helper_stopMonitoringForRegion:region];
}

#pragma mark - CoreLocation authorization

/**
 * Request authorisation for use when app is in foreground.
 */
- (void)requestWhenInUseAuthorization:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC requestWhenInUseAuthorization");

    // Only applicable on iOS 8 and above.
    if (IsAtLeastiOSVersion(@"8.0"))
	{
		[self.beaconManager requestWhenInUseAuthorization];
	}

	// Return OK to JavaScript.
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

/**
 * Request authorisation for use also when app is in background.
 */
- (void)requestAlwaysAuthorization:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC requestAlwaysAuthorization");

    // Only applicable on iOS 8 and above.
    if (IsAtLeastiOSVersion(@"8.0"))
	{
		[self.beaconManager requestAlwaysAuthorization];
	}

	// Return OK to JavaScript.
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK]
		callbackId:command.callbackId];
}

/**
 * Request authorisation for use also when app is in background.
 */
- (void)authorizationStatus:(CDVInvokedUrlCommand*)command
{
	NSLog(@"OBJC authorizationStatus");

	// Default value.
	// TODO: Should we use the real value also on iOS 7? Is it available?
	CLAuthorizationStatus status = kCLAuthorizationStatusNotDetermined;

    // Only available on iOS 8 and above.
    if (IsAtLeastiOSVersion(@"8.0"))
	{
		status = [ESTBeaconManager authorizationStatus];
	}

	// Return status value to JavaScript.
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_OK
			messageAsInt:status]
		callbackId:command.callbackId];
}

// TODO: Rewrite methods below to use callbacks.

/*
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
}

- (void)connectToBeaconByMacAddress:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];

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
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];

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

- (void)setAdvIntervalOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{

	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];

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

}

- (void)setPowerOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{

	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];

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
}

- (void)updateFirmwareOfConnectedBeacon:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];

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
}

- (void)getFirmwareUpdateProgress:(CDVInvokedUrlCommand*)command
{
	[self.commandDelegate
		sendPluginResult:[CDVPluginResult
			resultWithStatus:CDVCommandStatus_ERROR
			messageAsString:@"Not implemented."]
		callbackId:command.callbackId];
	if(self.firmwareUpdateProgress != nil) {
		[self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK
																 messageAsString:self.firmwareUpdateProgress] callbackId:command.callbackId];
	} else {
		[self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No beacon is being updated right now."] callbackId:command.callbackId];
	}
}

#pragma mark - Beacon Manager delegate methods.

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
*/

@end
