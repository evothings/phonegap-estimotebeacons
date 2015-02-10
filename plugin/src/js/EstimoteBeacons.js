var exec = cordova.require('cordova/exec');

/*
	Contents of this file:
	* Common Helper Functions
	* Estimote Beacon Functions
	* Estimote Stickers Functions
*/

/*********************************************************/
/**************** Common Helper Functions ****************/
/*********************************************************/

/**
 * Helpers
 */
function isString(value)
{
	return (typeof value == 'string' || value instanceof String);
}

function isInt(value)
{
	return !isNaN(parseInt(value, 10)) && (parseFloat(value, 10) == parseInt(value, 10));
}

function checkExecParamsRegionSuccessError(region, success, error)
{
	var caller = checkExecParamsRegionSuccessError.caller.name

	if (typeof region != 'object') {
		console.error('Error: region parameter is not an object in: ' + caller);
		return false;
	}

	if (typeof success != 'function') {
		console.error('Error: success parameter is not a function in: ' + caller);
		return false;
	}

	if (typeof error != 'function') {
		console.error('Error: error parameter is not a function in: ' + caller);
		return false;
	}

	return true;
}

function checkExecParamsSuccessError(success, error)
{
	var caller = checkExecParamsSuccessError.caller.name

	if (typeof success != 'function') {
		console.error('Error: success parameter is not a function in: ' + caller);
		return false;
	}

	if (typeof error != 'function') {
		console.error('Error: error parameter is not a function in: ' + caller);
		return false;
	}

	return true;
}

function checkExecParamsRegion(region)
{
	var caller = checkExecParamsRegion.caller.name

	if (typeof region != 'object') {
		console.error('Error: region parameter is not an object in: ' + caller);
		return false;
	}

	return true;
}

/*********************************************************/
/******************* Estimote Objects ********************/
/*********************************************************/

/**
 *  Object that is exported. Holds two modules, beacons and nearables.
 */
var estimote = {};
estimote.beacons = {};
estimote.nearables = {};

/**
 * Print an object. Useful for debugging. Example calls:
 *   estimote.printObject(obj);
 *   estimote.printObject(obj, console.log);
 */
estimote.printObject = function(obj, printFun)
{
	if (!printFun) { printFun = console.log; }
	function print(obj, level)
	{
		var indent = new Array(level + 1).join('  ');
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var value = obj[prop];
				if (typeof value == 'object') {
					printFun(indent + prop + ':');
					print(value, level + 1);
				}
				else {
					printFun(indent + prop + ': ' + value);
				}
			}
		}
	}
	print(obj, 0);
};

/*********************************************************/
/*************** Estimote Beacon Functions ***************/
/*********************************************************/

/**
 * Proximity values.
 */
estimote.beacons.ProximityUnknown = 0;
estimote.beacons.ProximityImmediate = 1;
estimote.beacons.ProximityNear = 2;
estimote.beacons.ProximityFar = 3;

/**
 * Beacon colours.
 */
estimote.beacons.BeaconColorUnknown = 0;
estimote.beacons.BeaconColorMint = 1;
estimote.beacons.BeaconColorIce = 2;
estimote.beacons.BeaconColorBlueberry = 3;
estimote.beacons.BeaconColorWhite = 4;
estimote.beacons.BeaconColorTransparent = 5;


/**
 * Region states.
 */
estimote.beacons.RegionStateUnknown = 'unknown';
estimote.beacons.RegionStateOutside = 'outside';
estimote.beacons.RegionStateInside = 'inside';

/**
 * Ask the user for permission to use location services
 * while the app is in the foreground.
 * You need to call this function or requestAlwaysAuthorization
 * on iOS 8+.
 * Does nothing on other platforms.
 *
 * @param success Function called on success (optional).
 * @param error Function called on error (optional).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example:
 *   estimote.beacons.requestWhenInUseAuthorization()
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
estimote.beacons.requestWhenInUseAuthorization = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_requestWhenInUseAuthorization',
		[]
	);

	return true;
};

/**
 * Ask the user for permission to use location services
 * whenever the app is running.
 * You need to call this function or requestWhenInUseAuthorization
 * on iOS 8+.
 * Does nothing on other platforms.
 *
 * @param success Function called on success (optional).
 * @param error Function called on error (optional).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example:
 *   estimote.beacons.requestAlwaysAuthorization()
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
estimote.beacons.requestAlwaysAuthorization = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_requestAlwaysAuthorization',
		[]
	);

	return true;
};

/**
 * Get the current location authorization status.
 * Implemented on iOS 8+.
 * Does nothing on other platforms.
 *
 * @param success Function called on success, the result param of the
 *   function contains the current authorization status (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(result)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example:
 *   estimote.beacons.authorizationStatus(
 *     function(result) {
 *       console.log('Location authorization status: ' + result) },
 *     function(errorMessage) {
 *       console.log('Error: ' + errorMessage) }
 *   )
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
estimote.beacons.authorizationStatus = function (success, error)
{
	if (!checkExecParamsSuccessError(success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_authorizationStatus',
		[]
	);

	return true;
};

/**
 * Start advertising as a beacon.
 *
 * @param uuid UUID string the beacon should advertise (string, mandatory).
 * @param major Major value to advertise (integer, mandatory).
 * @param minor Minor value to advertise (integer, mandatory).
 * @param regionId Identifier of the region used to advertise (string, mandatory).
 * @param success Function called on success (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that starts advertising:
 *   estimote.beacons.startAdvertisingAsBeacon(
 *     'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
 *     1,
 *     1,
 *     'MyRegion',
 *     function(result) {
 *       console.log('Beacon started') },
 *     function(errorMessage) {
 *       console.log('Error starting beacon: ' + errorMessage) }
 *   )
 */
estimote.beacons.startAdvertisingAsBeacon = function (
	uuid, major, minor, regionId, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startAdvertisingAsBeacon',
		[uuid, major, minor, regionId]
	);

	return true;
};

/**
 * Stop advertising as a beacon.
 *
 * @param success Function called on success (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops advertising:
 *   estimote.beacons.stopAdvertisingAsBeacon(
 *     function(result) {
 *       console.log('Beacon stopped') },
 *     function(errorMessage) {
 *       console.log('Error stopping beacon: ' + errorMessage) }
 *   )
 */
estimote.beacons.stopAdvertisingAsBeacon = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopAdvertisingAsBeacon',
		[]
	);

	return true;
};

/**
 * Enable analytics. For further details see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html
 *
 * @param enable Boolean value to turn analytics on or off (mandatory).
 * @param success Function called on success (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that enables analytics:
 *   estimote.beacons.enableAnalytics(true)
 */
estimote.beacons.enableAnalytics = function (enable, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_enableAnalytics',
		[enable]
	);

	return true;
};

/**
 * Test if analytics is enabled. For further details see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html
 *
 * @param success Function called on success (mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success(enabled)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that displays analytics enabled value:
 *   estimote.beacons.isAnalyticsEnabled(function(enabled) {
 *      console.log('Analytics enabled: ' + enabled) })
 */
estimote.beacons.isAnalyticsEnabled = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_isAnalyticsEnabled',
		[]
	);

	return true;
};

/**
 * Test if App ID and App Token is set. For further details see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html
 *
 * @param success Function called on success (mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success(isAuthorized)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that displays the authorisation value:
 *   estimote.beacons.isAuthorized(function(isAuthorized) {
 *      console.log('App ID and App Token is set: ' + isAuthorized) })
 */
estimote.beacons.isAuthorized = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_isAuthorized',
		[]
	);

	return true;
};

/**
 * Set App ID and App Token. For further details see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html
 *
 * @param success Function called on success (mandatory).
 * @param success Function called on success (mandatory).
 * @param success Function called on success (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success(isAuthorized)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that sets App ID and App Token:
 *   estimote.beacons.setupAppIDAndAppToken('MyAppID', 'MyAppToken')
 */
estimote.beacons.setupAppIDAndAppToken = function (appID, appToken, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_setupAppIDAndAppToken',
		[appID, appToken]
	);

	return true;
};

/**
 * Start scanning for beacons using CoreBluetooth.
 *
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are detected (mandatory).
 * @param error Function called on error (mandatory).
 *
 * region format:
 *   {
 *     uuid: string,
 *     identifier: string,
 *     major: number,
 *     minor: number,
 *     secure: boolean
 *   }
 *
 * The region field 'secure' is supported on iOS for enabling
 * secure beacon regions. Leaving it out defaults to false.
 * See this article for further info:
 * https://community.estimote.com/hc/en-us/articles/204233603-How-security-feature-works
 *
 * success callback format:
 *   success(beaconInfo)
 *
 * beaconInfo format:
 *   {
 *     region: region,
 *     beacons: array of beacon
 *   }
 *
 * beacon format:
 *   {
 *     // See documented properties at:
 *     // http://estimote.github.io/iOS-SDK/Classes/ESTBeacon.html
 *   }
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that prints all discovered beacons and properties:
 *   estimote.beacons.startEstimoteBeaconsDiscoveryForRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('Beacons discovered:')
 *       estimote.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Discovery error: ' + errorMessage) }
 *   )
 */
estimote.beacons.startEstimoteBeaconsDiscoveryForRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startEstimoteBeaconsDiscoveryForRegion',
		[region]
	);

	return true;
};

/**
 * Stop CoreBluetooth scan.
 *
 * @param success Function called when beacons are detected (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops discovery:
 *   estimote.beacons.stopEstimoteBeaconDiscovery()
 */
estimote.beacons.stopEstimoteBeaconDiscovery = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopEstimoteBeaconDiscovery',
		[]
	);

	return true;
};

/**
 * Start ranging beacons using CoreLocation.
 *
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are ranged (mandatory).
 * @param error Function called on error (mandatory).
 *
 * See function startEstimoteBeaconsDiscoveryForRegion for region format.
 *
 * success callback format:
 *   success(beaconInfo)
 *
 * See function startEstimoteBeaconsDiscoveryForRegion for beaconInfo format.
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that prints all beacons and properties:
 *   estimote.beacons.startRangingBeaconsInRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('Beacons ranged:')
 *       estimote.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
estimote.beacons.startRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startRangingBeaconsInRegion',
		[region]
	);

	return true;
};

/**
 * Stop ranging beacons using CoreLocation.
 *
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when ranging is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops ranging:
 *   estimote.beacons.stopRangingBeaconsInRegion({})
 */
estimote.beacons.stopRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopRangingBeaconsInRegion',
		[region]
	);

	return true;
};

/**
 * Start monitoring beacons using CoreLocation.
 *
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are enter/exit the region (mandatory).
 * @param error Function called on error (mandatory).
 * @param notifyEntryStateOnDisplay Set to true to detect if you
 * are inside a region when the user turns display on (optional,
 * defaults to false, iOS only).
 *
 * See function startEstimoteBeaconsDiscoveryForRegion for region format.
 *
 * Details regarding parameter notifyEntryStateOnDisplay from the iOS documentation:
 *
 * 'When set to YES, the location manager sends beacon notifications when
 * the user turns on the display and the device is already inside the region.
 * These notifications are sent even if your app is not running. In that
 * situation, the system launches your app into the background so that it
 * can handle the notifications. In both situations, the location manager
 * calls the locationManager:didDetermineState:forRegion: method of its
 * delegate object.
 * The default value for this property is NO.
 *
 * success callback format:
 *   success(regionState)
 *
 * regionState format:
 *   {
 *     uuid: string,
 *     identifier: string,
 *     major: number,
 *     minor: number,
 *     state: string ['outside'|'inside'|'unknown']
 *   }
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that prints regionState properties:
 *   estimote.beacons.startMonitoringForRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('Region state:')
 *       estimote.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) }
 *   )
 */
estimote.beacons.startMonitoringForRegion = function (
	region, success, error, notifyEntryStateOnDisplay)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startMonitoringForRegion',
		[region, !!notifyEntryStateOnDisplay]
	);

	return true;
};

/**
 * Stop monitoring beacons using CoreLocation.
 *
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when monitoring is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops monitoring:
 *   estimote.beacons.stopMonitoringForRegion({})
 */
estimote.beacons.stopMonitoringForRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopMonitoringForRegion',
		[region]
	);

	return true;
};


/*********************************************************/
/************** Estimote Stickers Functions **************/
/*********************************************************/


/**
 * Nearable types.
 */
estimote.nearables.NearableTypeUnknown = 0;
estimote.nearables.NearableTypeDog = 1;
estimote.nearables.NearableTypeCar = 2;
estimote.nearables.NearableTypeFridge = 3;
estimote.nearables.NearableTypeBag = 4;
estimote.nearables.NearableTypeBike = 5;
estimote.nearables.NearableTypeChair = 6;
estimote.nearables.NearableTypeBed = 7;
estimote.nearables.NearableTypeDoor = 8;
estimote.nearables.NearableTypeShoe = 9;
estimote.nearables.NearableTypeGeneric = 10;
estimote.nearables.NearableTypeAll = 11;

/**
 * Nearable zones.
 */
estimote.nearables.NearableZoneUnknown = 0;
estimote.nearables.NearableZoneImmediate = 1;
estimote.nearables.NearableZoneNear = 2;
estimote.nearables.NearableZoneFar = 3;

/**
 * Nearable orientations.
 */
estimote.nearables.NearableOrientationUnknown = 0;
estimote.nearables.NearableOrientationHorizontal = 1;
estimote.nearables.NearableOrientationHorizontalUpsideDown = 2;
estimote.nearables.NearableOrientationVertical = 3;
estimote.nearables.NearableOrientationVerticalUpsideDown = 4;
estimote.nearables.NearableOrientationLeftSide = 5;
estimote.nearables.NearableOrientationRightSide = 6;

/**
 * Nearable colours.
 */
estimote.nearables.NearableColorUnknown = 0;
estimote.nearables.NearableColorMintCocktail = 1;
estimote.nearables.NearableColorIcyMarshmallow = 0;
estimote.nearables.NearableColorBlueberryPie = 0;
estimote.nearables.NearableColorSweetBeetroot = 0;
estimote.nearables.NearableColorCandyFloss = 0;
estimote.nearables.NearableColorLemonTart = 0;

/**
 * Start ranging for nearables with the given identifier.
 *
 * @param identifier String with nearable id (mandatory).
 * @param success Function called when the nearable with the
 * given id is ranged (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(nearable)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * nearable format:
 *   {
 *     type: number,
 *     nameForType: string,
 *     color: number,
 *     nameForColor: string,
 *     identifier: string,
 *     hardwareVersion: string,
 *     firmwareVersion: string,
 *     rssi: number,
 *     zone: number,
 *     idleBatteryVoltage: number,
 *     stressBatteryVoltage: number,
 *     currentMotionStateDuration: number,
 *     previousMotionStateDuration: number,
 *     isMoving: bool,
 *     orientation: number,
 *     xAcceleration: number,
 *     yAcceleration: number,
 *     zAcceleration: number,
 *     temperature: number,
 *     power: number,
 *     channel: number,
 *     firmwareState: number
 *   }
 *
 * For detailed specification of Nearable properties see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTNearable.html
 *
 * Example that prints ranged nearable:
 *   estimote.nearables.startRangingForIdentifier(
 *     '12e31',
 *     function(nearable) {
 *       console.log('Nearable ranged:')
 *       estimote.printObject(nearable) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
estimote.nearables.startRangingForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_startRangingForIdentifier',
		[identifier]
	);

	return true;
};

/**
 * Stop ranging for nearables with the given identifier.
 *
 * @param identifier String with nearable id (mandatory).
 * @param success Function called when ranging is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops ranging:
 *   estimote.nearables.stopRangingForIdentifier(identifier)
 */
estimote.nearables.stopRangingForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopRangingForIdentifier',
		[identifier]
	);

	return true;
};

/**
 * Start ranging for nearables of the given type.
 *
 * @param type Nearable type - one of the
 * ESTNearableType* constants (mandatory).
 * @param success Function called when the nearable with the
 * given id is ranged (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(nearables)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * nearables format: array of nearable
 *
 * nearable format: see function estimote.nearables.startRangingForIdentifier
 *
 * Example that prints all ranged nearables:
 *   estimote.nearables.startRangingForType(
 *     estimote.nearables.NearableTypeAll,
 *     function(nearables) {
 *       console.log('Nearables ranged:')
 *       estimote.printObject(nearables) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
estimote.nearables.startRangingForType = function (type, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_startRangingForType',
		[type]
	);

	return true;
};

/**
 * Stop ranging for nearables of the given type.
 *
 * @param type Nearable type - one of the ESTNearableType* constants (mandatory).
 * @param success Function called when ranging is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops ranging:
 *   estimote.nearables.stopRangingForType(estimote.nearables.NearableTypeAll)
 */
estimote.nearables.stopRangingForType = function (type, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopRangingForType',
		[type]
	);

	return true;
};

/**
 * Stop ranging all nearables.
 *
 * @param success Function called when ranging is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops ranging:
 *   estimote.nearables.stopRanging()
 */
estimote.nearables.stopRanging = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopRanging',
		[]
	);

	return true;
};

/**
 * Start monitoring for nearables with the given identifier.
 *
 * @param identifier String with nearable id (mandatory).
 * @param success Function called when the nearable with the
 * given id is monitored (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(identifierRegionState)
 *
 * identifierRegionState format:
 *   {
 *     identifier: string,
 *     state: string ['outside'|'inside']
 *   }
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that prints state for monitored identifier:
 *   estimote.nearables.startMonitoringForIdentifier(
 *     '12e31',
 *     function(state) {
 *       console.log('Nearable monitored:')
 *       estimote.printObject(state) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) }
 *   )
 */
estimote.nearables.startMonitoringForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_startMonitoringForIdentifier',
		[identifier]
	);

	return true;
};

/**
 * Stop monitoring for nearables with the given identifier.
 *
 * @param identifier String with nearable id (mandatory).
 * @param success Function called when monitoring is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops monitoring:
 *   estimote.nearables.stopMonitoringForIdentifier(identifier)
 */
estimote.nearables.stopMonitoringForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopMonitoringForIdentifier',
		[identifier]
	);

	return true;
};

/**
 * Start monitoring for nearables of the given type.
 *
 * @param type Nearable type - one of the ESTNearableType*
 * constants (mandatory).
 * @param success Function called when nearables with the given
 * type is monitored (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(typeRegionState)
 *
 * typeRegionState format:
 *   {
 *     type: number, // one of the ESTNearableType* values
 *     state: string ['outside'|'inside']
 *   }
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that prints state for monitored type:
 *   estimote.nearables.startMonitoringForType(
 *     estimote.nearables.NearableTypeAll,
 *     function(state) {
 *       console.log('Nearables monitored:')
 *       estimote.printObject(state) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) }
 *   )
 */
estimote.nearables.startMonitoringForType = function (type, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_startMonitoringForType',
		[type]
	);

	return true;
};

/**
 * Stop monitoring for nearables of the given type.
 *
 * @param type Nearable type - one of the ESTNearableType* constants (mandatory).
 * @param success Function called when monitoring is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops monitoring:
 *   estimote.nearables.stopMonitoringForType(estimote.nearables.NearableTypeAll)
 */
estimote.nearables.stopMonitoringForType = function (type, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopMonitoringForType',
		[type]
	);

	return true;
};

/**
 * Stop monitoring all nearables.
 *
 * @param success Function called when monitoring is stopped (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * success callback format:
 *   success()
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example that stops monitoring:
 *   estimote.nearables.stopMonitoring()
 */
estimote.nearables.stopMonitoring = function (success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'nearables_stopMonitoring',
		[]
	);

	return true;
};

/*********************************************************/
/******************* Trigger Functions *******************/
/*********************************************************/

estimote.triggers = {};
estimote.triggers.RuleTypeGeneric = 1;
estimote.triggers.RuleTypeNearableIdentifier = 2;
estimote.triggers.RuleTypeNearableType = 4;

var ruleCounter = 0;

// Helper function.
function helper_createTriggerObject(trigger)
{
	var triggerObject = {};

	triggerObject.triggerIdentifier = trigger.identifier;

	triggerObject.rules = [];
	for (var i = 0; i < trigger.rules.length; ++i)
	{
		var rule = trigger.rules[i];
		triggerObject.rules.push({
			ruleType: rule.ruleType,
			ruleIdentifier: rule.ruleIdentifier,
			nearableIdentifier: rule.nearableIdentifier,
			nearableType: rule.nearableType });
	}

	return triggerObject;
}

// Helper function.
function helper_updateTriggerRule(trigger, event)
{
	var rule = trigger.ruleTable[event.ruleIdentifier];
	if (rule && rule.ruleUpdateFunction)
	{
		rule.ruleUpdateFunction(event);
	}
}

/**
 * Create a trigger object.
 *
 * @param triggerIdentifier String that uniquely identifies the trigger.
 * You can choose any identifiers as long as they are unique
 * within the application.
 * @param rules Array of rule objects that will be used by the trigger.
 *
 * Example that stops monitoring:
 *   estimote.nearables.stopMonitoring()
 */
estimote.triggers.createTrigger = function(triggerIdentifier, rules)
{
	var trigger = {};

	trigger.state = false;
	trigger.identifier = triggerIdentifier;
	trigger.rules = rules;

	// Create table for rule ids for quick lookup.
	trigger.ruleTable = {};
	for (var i = 0; i < rules.length; ++i)
	{
		var rule = rules[i];
		trigger.ruleTable[rule.ruleIdentifier] = rule;
	}

	return trigger;
};

/**
 * Create a basic rule object.
 *
 * @param ruleUpdateFunction Function that is called when the
 * rule state should be updated. Specify your rule login in
 * this function.
 *
 * Update callback function format:
 *   ruleUpdateFunction(ruleEvent)
 *
 * ruleEvent object format:
 *   {
 *     nearable: object // Nearable object
 *     eventType: string, // used internally
 *     triggerIdentifier: string, // used internally
 *     triggerState: boolean, // used internally
 *     ruleIdentifier: string // used internally
 *   }
 *
 * The field of interest when writing the rule update function
 * is 'nearable', which is an object with all properties for
 * the nearable monitored by the rule.
 *
 * Use the ruleEvent object to pass the state of the rule
 * to the trigger engine. This is done using the function:
 *   estimote.triggers.updateRuleState(ruleEvent, state)
 *
 * For example, to signal that the rule state is true you call:
 *   estimote.triggers.updateRuleState(ruleEvent, true)
 */
estimote.triggers.createRule = function(ruleUpdateFunction)
{
	var rule = {};
	rule.ruleType = estimote.triggers.RuleTypeGeneric;
	rule.ruleUpdateFunction = ruleUpdateFunction;
	rule.ruleIdentifier = 'Rule' + (++ruleCounter);
	return rule;
};

/**
 * Create a rule object for a nearable identifier.
 *
 * @param nearableIdentifier String with the nearable identifier.
 * This specifies the specific nearable that will be monitoried
 * by the rule.
 * @param ruleUpdateFunction See estimote.triggers.createRule().
 */
estimote.triggers.createRuleForIdentifier = function(nearableIdentifier, ruleUpdateFunction)
{
	var rule = estimote.triggers.createRule(ruleUpdateFunction);
	rule.ruleType = estimote.triggers.RuleTypeNearableIdentifier;
	rule.nearableIdentifier = nearableIdentifier;
	return rule;
};

/**
 * Create a rule object for a nearable type.
 *
 * @param nearableType Number for the nearable type to monitor.
 * This specifies the type of nearable that will be monitoried
 * by the rule.
 * @param ruleUpdateFunction See estimote.triggers.createRule().
 */
estimote.triggers.createRuleForType = function(nearableType, ruleUpdateFunction)
{
	var rule = estimote.triggers.createRule(ruleUpdateFunction);
	rule.ruleType = estimote.triggers.RuleTypeNearableType;
	rule.nearableType = nearableType;
	return rule;
};

/**
 * Start monitoring a trigger.
 *
 * @param trigger Trigger object to monitor.
 * @param triggerCallback Function called when the trigger changes state.
 * @param errorCallback Function called on error.
 *
 * Format for triggerCallback:
 *   triggerCallback(trigger)
 *
 * trigger.state contains the current state of the trigger, it is true
 * if the trigger holds, false if not.
 *
 * Format for errorCallback:
 *   errorCallback(errorMessage)
 *
 * Code example:
 *
 *   // Called when trigger changes state.
 *   function onTriggerChangedState(trigger) {
 *       if (trigger.state)
 *           console.log('Dog is moving')
 *       else
 *           console.log('Dog is still')
 *   }
 *
 *   // Called is case of error.
 *   function onTriggerError(errorMessage) {
 *       console.log('Trigger error: ' + errorMessage)
 *   }
 *
 *   // Rule function.
 *   function dogIsMovingFunction(event) {
 *       if (event.nearable.isMoving)
 *           estimote.triggers.updateRuleState(event, true)
 *       else
 *           estimote.triggers.updateRuleState(event, false)
 *   }
 *
 *   // Trigger rule.
 *   var dogRule = estimote.triggers.createRuleForType(
 *       estimote.nearables.NearableTypeDog,
 *       dogIsMovingFunction)
 *
 *	 // Trigger.
 *   var trigger = estimote.triggers.createTrigger('DogTrigger', [dogRule])
 *
 *   // Start monitoring for trigger.
 *   estimote.triggers.startMonitoringForTrigger(
 *       trigger,
 *       onTriggerChangedState,
 *       onTriggerError)
 */
estimote.triggers.startMonitoringForTrigger = function(trigger, triggerCallback, errorCallback)
{
	function internalCallback(event)
	{
		if (event.triggerIdentifier == trigger.identifier)
		{
			if ('triggerChangedState' == event.eventType)
			{
				trigger.state = event.triggerState;
				triggerCallback(trigger);
			}
			else if ('update' == event.eventType)
			{
				helper_updateTriggerRule(trigger, event);
			}
		}
	}

	var triggerObject = helper_createTriggerObject(trigger);

	exec(internalCallback,
		errorCallback,
		'EstimoteBeacons',
		'triggers_startMonitoringForTrigger',
		[triggerObject]
	);

	return true;
};

/**
 * Stop monitoring a trigger.
 *
 * @param trigger Trigger to stop monitoring.
 * @param success Function called on success (non-mandatory).
 * @param error Function called on error (non-mandatory).
 *
 * Format for success function:
 *   success()
 *
 * Format for error function:
 *   error(errorMessage)
 *
 * Example call:
 *   estimote.triggers.stopMonitoringForTrigger(trigger)
 */
estimote.triggers.stopMonitoringForTrigger = function(trigger, success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'triggers_stopMonitoringForTrigger',
		[trigger.identifier]
	);

	return true;
};

/**
 * Used to update the state of a native rule during an update event.
 *
 * @param ruleEvent Event object passed to the event update function.
 * @param state true if rule holds, false if rule does not hold.
 *
 * Example call:
 *   estimote.triggers.updateRuleState(ruleEvent, true)
 */
estimote.triggers.updateRuleState = function(event, state)
{
	exec(null,
		null,
		'EstimoteBeacons',
		'triggers_updateRuleState',
		[event.triggerIdentifier, event.ruleIdentifier, state]
	);

	return true;
};

/*********************************************************/
/************** Unused/Old Beacon Functions **************/
/*********************************************************/

/*
EstimoteBeacons.getBeaconByIdx = function (idx, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isInt(idx)) {
        console.error("EstimoteBeacons.getBeaconByIdx failure: index must be a valid integer");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.getBeaconByIdx failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.getBeaconByIdx failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "getBeaconByIdx",
        [idx]
    );
};

EstimoteBeacons.getClosestBeacon = function (successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.getClosestBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.getClosestBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "getClosestBeacon",
        []
    );
};

EstimoteBeacons.getConnectedBeacon = function (successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.getConnectedBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.getConnectedBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "getConnectedBeacon",
        []
    );
};

EstimoteBeacons.connectToBeacon = function (major, minor, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isInt(major)) {
        console.error("EstimoteBeacons.connectToBeacon failure: major must be a valid integer");
        return;
    }

    if (!isInt(minor)) {
        console.error("EstimoteBeacons.connectToBeacon failure: minor must be a valid integer");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.connectToBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.connectToBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "connectToBeacon",
        [major, minor]
    );
};

EstimoteBeacons.connectToBeaconByMacAddress = function (macAddress, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.connectToBeaconByMacAddress failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.connectToBeaconByMacAddress failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "connectToBeaconByMacAddress",
        [macAddress]
    );
};

EstimoteBeacons.disconnectFromBeacon = function (successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.disconnectFromBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.disconnectFromBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "disconnectFromBeacon",
        []
    );
};

EstimoteBeacons.setAdvIntervalOfConnectedBeacon = function (advInterval, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isInt(advInterval)) {
        console.error("EstimoteBeacons.setAdvIntervalOfConnectedBeacon failure: advInterval must be a valid integer");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.setAdvIntervalOfConnectedBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.setAdvIntervalOfConnectedBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "setAdvIntervalOfConnectedBeacon",
        [advInterval]
    );
};

EstimoteBeacons.setPowerOfConnectedBeacon = function (power, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isInt(power)) {
        console.error("EstimoteBeacons.setPowerOfConnectedBeacon failure: power must be a valid integer");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.setPowerOfConnectedBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.setPowerOfConnectedBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "setPowerOfConnectedBeacon",
        [power]
    );
};

EstimoteBeacons.updateFirmwareOfConnectedBeacon = function (progressCallback, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.updateFirmwareOfConnectedBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.updateFirmwareOfConnectedBeacon failure: success callback parameter must be a function");
        return;
    }

    var progressInterval;

    exec(function () {
            if (progressInterval) {
                clearInterval(progressInterval);
            }

            successCallback.apply(this, arguments);
        },
        function () {
            if (progressInterval) {
                clearInterval(progressInterval);
            }

            errorCallback.apply(this, arguments);
        },
        "EstimoteBeacons",
        "updateFirmwareOfConnectedBeacon",
        []
    );

    if (typeof progressCallback === "function") {
        progressInterval = setInterval(function () {
            exec(progressCallback,
                function (error) {
                    console.error("Error", error);
                },
                "EstimoteBeacons",
                "getFirmwareUpdateProgress",
                []
            );
        }, 100);
    }
};

EstimoteBeacons.getBeacons = function (successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.getBeacons failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "getBeacons",
        []
    );
};

EstimoteBeacons.startVirtualBeacon = function (major, minor, id, successCallback) {
    if (!isInt(major)) {
        console.error("EstimoteBeacons.startVirtualBeacon failure: major must be a valid integer");
        return;
    }

    if (!isInt(minor)) {
        console.error("EstimoteBeacons.startVirtualBeacon failure: minor must be a valid integer");
        return;
    }

    if(!isString(id)) {
        console.error("EstimoteBeacons.startVirtualBeacon failure: id must be a string");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.startVirtualBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function(){},
        "EstimoteBeacons",
        "startVirtualBeacon",
        [major, minor, id]
    );
};

EstimoteBeacons.stopVirtualBeacon = function(successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.stopVirtualBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function(){},
        "EstimoteBeacons",
        "stopVirtualBeacon",
        []
    );
};
*/

// For backwards compatibility.
estimote.beacons.printObject = estimote.printObject
window.EstimoteBeacons = estimote.beacons;

module.exports = estimote;
