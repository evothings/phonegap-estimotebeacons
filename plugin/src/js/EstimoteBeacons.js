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

	if (typeof region != "object") {
		console.error("Error: region parameter is not an object in: " + caller);
		return false;
	}

	if (typeof success != "function") {
		console.error("Error: success parameter is not a function in: " + caller);
		return false;
	}

	if (typeof error != "function") {
		console.error("Error: error parameter is not a function in: " + caller);
		return false;
	}

	return true;
}

function checkExecParamsSuccessError(success, error)
{
	var caller = checkExecParamsSuccessError.caller.name

	if (typeof success != "function") {
		console.error("Error: success parameter is not a function in: " + caller);
		return false;
	}

	if (typeof error != "function") {
		console.error("Error: error parameter is not a function in: " + caller);
		return false;
	}

	return true;
}

function checkExecParamsRegion(region)
{
	var caller = checkExecParamsRegion.caller.name

	if (typeof region != "object") {
		console.error("Error: region parameter is not an object in: " + caller);
		return false;
	}

	return true;
}

/*********************************************************/
/*************** Estimote Beacon Functions ***************/
/*********************************************************/

/**
 * Object that holds beacon functions.
 */
var EstimoteBeacons = {}

/**
 * Proximity values.
 */
EstimoteBeacons.ProximityUnknown = 0;
EstimoteBeacons.ProximityImmediate = 1;
EstimoteBeacons.ProximityNear = 2;
EstimoteBeacons.ProximityFar = 3;

/**
 * Beacon colours.
 */
EstimoteBeacons.BeaconColorUnknown = 0;
EstimoteBeacons.BeaconColorMint = 1;
EstimoteBeacons.BeaconColorIce = 2;
EstimoteBeacons.BeaconColorBlueberry = 3;
EstimoteBeacons.BeaconColorWhite = 4;
EstimoteBeacons.BeaconColorTransparent = 5;

/**
 * Region states.
 */
EstimoteBeacons.RegionStateUnknown = "unknown";
EstimoteBeacons.RegionStateOutside = "outside";
EstimoteBeacons.RegionStateInside = "inside";

/**
 * Print an object. Use for debugging. Example calls:
 *   EstimoteBeacons.printObject(obj);
 *   EstimoteBeacons.printObject(obj, console.log);
 */
EstimoteBeacons.printObject = function(obj, printFun)
{
	if (!printFun) { printFun = console.log; }
	function print(obj, level)
	{
		var indent = new Array(level + 1).join("  ");
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var value = obj[prop];
				if (typeof value == "object") {
					printFun(indent + prop + ":");
					print(value, level + 1);
				}
				else {
					printFun(indent + prop + ": " + value);
				}
			}
		}
	}
	print(obj, 0);
};

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
 *   EstimoteBeacons.requestWhenInUseAuthorization()
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
EstimoteBeacons.requestWhenInUseAuthorization = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_requestWhenInUseAuthorization",
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
 *   EstimoteBeacons.requestAlwaysAuthorization()
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
EstimoteBeacons.requestAlwaysAuthorization = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_requestAlwaysAuthorization",
		[]
	);

	return true;
};

/**
 * Get the current location authorization status.
 * Implemented on iOS 8+.
 * Does nothing on other platforms.
 *
 * @param success Function called on success (mandatory).
 * @param error Function called on error (mandatory).
 *
 * success callback format:
 *   success(result)
 *
 * error callback format:
 *   error(errorMessage)
 *
 * Example:
 *   EstimoteBeacons.authorizationStatus(
 *     function(result) {
 *       console.log('Location authorization status: ' + result) },
 *     function(errorMessage) {
 *       console.log('Error: ' + errorMessage) }
 *   )
 *
 * More information:
 *   https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
 */
EstimoteBeacons.authorizationStatus = function (success, error)
{
	if (!checkExecParamsSuccessError(success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_authorizationStatus",
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
 *   EstimoteBeacons.startAdvertisingAsBeacon(
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
EstimoteBeacons.startAdvertisingAsBeacon = function (
	uuid, major, minor, regionId, success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_startAdvertisingAsBeacon",
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
 *   EstimoteBeacons.stopAdvertisingAsBeacon(
 *     function(result) {
 *       console.log('Beacon stopped') },
 *     function(errorMessage) {
 *       console.log('Error stopping beacon: ' + errorMessage) }
 *   )
 */
EstimoteBeacons.stopAdvertisingAsBeacon = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_stopAdvertisingAsBeacon",
		[]
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
 *   }
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
 *   EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('*** Beacons discovered ***')
 *       EstimoteBeacons.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Discovery error: ' + errorMessage) }
 *   )
 */
EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_startEstimoteBeaconsDiscoveryForRegion",
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
 *   EstimoteBeacons.stopEstimoteBeaconDiscovery()
 */
EstimoteBeacons.stopEstimoteBeaconDiscovery = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_stopEstimoteBeaconDiscovery",
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
 *   EstimoteBeacons.startRangingBeaconsInRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('*** Beacons ranged ***')
 *       EstimoteBeacons.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
EstimoteBeacons.startRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_startRangingBeaconsInRegion",
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
 *   EstimoteBeacons.stopRangingBeaconsInRegion({})
 */
EstimoteBeacons.stopRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_stopRangingBeaconsInRegion",
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
 * "When set to YES, the location manager sends beacon notifications when
 * the user turns on the display and the device is already inside the region.
 * These notifications are sent even if your app is not running. In that
 * situation, the system launches your app into the background so that it
 * can handle the notifications. In both situations, the location manager
 * calls the locationManager:didDetermineState:forRegion: method of its
 * delegate object.
 * The default value for this property is NO."
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
 *   EstimoteBeacons.startMonitoringForRegion(
 *     {}, // Empty region matches all beacons.
 *     function(result) {
 *       console.log('*** Region state ***')
 *       EstimoteBeacons.printObject(result) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) }
 *   )
 */
EstimoteBeacons.startMonitoringForRegion = function (
	region, success, error, notifyEntryStateOnDisplay)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_startMonitoringForRegion",
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
 *   EstimoteBeacons.stopMonitoringForRegion({})
 */
EstimoteBeacons.stopMonitoringForRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"beacons_stopMonitoringForRegion",
		[region]
	);

	return true;
};


/*********************************************************/
/************** Estimote Stickers Functions **************/
/*********************************************************/


/**
 * Object that holds nearable functions.
 */
var EstimoteNearables = {}

/**
 * Nearable types.
 */
EstimoteNearables.ESTNearableTypeUnknown = 0;
EstimoteNearables.ESTNearableTypeDog = 1;
EstimoteNearables.ESTNearableTypeCar = 2;
EstimoteNearables.ESTNearableTypeFridge = 3;
EstimoteNearables.ESTNearableTypeBag = 4;
EstimoteNearables.ESTNearableTypeBike = 5;
EstimoteNearables.ESTNearableTypeChair = 6;
EstimoteNearables.ESTNearableTypeBed = 7;
EstimoteNearables.ESTNearableTypeDoor = 8;
EstimoteNearables.ESTNearableTypeShoe = 9;
EstimoteNearables.ESTNearableTypeGeneric = 10;
EstimoteNearables.ESTNearableTypeAll = 11;

/**
 * Start ranging for Nearable with the given identifier.
 *
 * @param identifier String with Nearable id (mandatory).
 * @param success Function called when the nearable with the given id is ranged (mandatory).
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
 *     txPower: number,
 *     channel: number,
 *     firmwareState: number
 *   }
 *
 * For detailed specification of Nearable properties see:
 * http://estimote.github.io/iOS-SDK/Classes/ESTNearable.html
 *
 * Example that prints ranged nearable:
 *   EstimoteNearables.startRangingForIdentifier(
 *     '12e31',
 *     function(nearable) {
 *       console.log('*** Nearable ranged ***')
 *       EstimoteBeacons.printObject(nearable) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
EstimoteNearables.startRangingForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"nearables_startRangingForIdentifier",
		[identifier]
	);

	return true;
};

/**
 * Stop ranging for Nearable with the given identifier.
 *
 * @param identifier String with Nearable id (mandatory).
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
 *   EstimoteNearables.stopRangingForIdentifier(identifier)
 */
EstimoteNearables.stopRangingForIdentifier = function (identifier, success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"nearables_stopRangingForIdentifier",
		[identifier]
	);

	return true;
};


/**
 * Start ranging for Nearables of the given type.
 *
 * @param type Nearable type - one of the ESTNearableType* constants (mandatory).
 * @param success Function called when the nearable with the given id is ranged (mandatory).
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
 * nearable format: see function EstimoteNearables.startRangingForIdentifier
 *
 * Example that prints all ranged nearables:
 *   EstimoteNearables.startRangingForType(
 *     EstimoteNearables.ESTNearableTypeAll,
 *     function(nearables) {
 *       console.log('*** Nearables ranged ***')
 *       EstimoteBeacons.printObject(nearables) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) }
 *   )
 */
EstimoteNearables.startRangingForType = function (type, success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"nearables_startRangingForType",
		[type]
	);

	return true;
};

/**
 * Stop ranging for Nearables of the given type.
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
 *   EstimoteNearables.stopRangingForType(EstimoteNearables.ESTNearableTypeAll)
 */
EstimoteNearables.stopRangingForType = function (type, success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"nearables_stopRangingForType",
		[type]
	);

	return true;
};

/**
 * Stop ranging all Nearables.
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
 *   EstimoteNearables.stopRanging()
 */
EstimoteNearables.stopRanging = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"nearables_stopRanging",
		[]
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

// Object that is exported. Holds two modules, beacons and nearables.
var estimote = {};
estimote.beacons = EstimoteBeacons;
estimote.nearables = EstimoteNearables;

// For backwards compatibility.
window.EstimoteBeacons = estimote.beacons;

module.exports = estimote;
