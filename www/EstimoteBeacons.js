
var exec = cordova.require('cordova/exec');

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

/**
 * Function object that holds other functions.
 */
function EstimoteBeacons()
{
}

/**
 * Beacon colours.
 */
EstimoteBeacons.prototype.BeaconColorUnknown = 0;
EstimoteBeacons.prototype.BeaconColorMint = 1;
EstimoteBeacons.prototype.BeaconColorIce = 2;
EstimoteBeacons.prototype.BeaconColorBlueberry = 3;
EstimoteBeacons.prototype.BeaconColorWhite = 4;
EstimoteBeacons.prototype.BeaconColorTransparent = 5;

/**
 * Region states.
 */
EstimoteBeacons.prototype.RegionStateUnknown = "unknown";
EstimoteBeacons.prototype.RegionStateOutside = "outside";
EstimoteBeacons.prototype.RegionStateInside = "inside";

/**
 * Print an object. Use for debugging. Example calls:
 *   EstimoteBeacons.printObject(obj);
 *   EstimoteBeacons.printObject(obj, console.log);
 */
EstimoteBeacons.prototype.printObject = function(obj, printFun)
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
EstimoteBeacons.prototype.requestWhenInUseAuthorization = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"requestWhenInUseAuthorization",
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
EstimoteBeacons.prototype.requestAlwaysAuthorization = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"requestAlwaysAuthorization",
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
EstimoteBeacons.prototype.authorizationStatus = function (success, error)
{
	if (!checkExecParamsSuccessError(success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"authorizationStatus",
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
EstimoteBeacons.prototype.startEstimoteBeaconsDiscoveryForRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"startEstimoteBeaconsDiscoveryForRegion",
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
EstimoteBeacons.prototype.stopEstimoteBeaconDiscovery = function (success, error)
{
	exec(success,
		error,
		"EstimoteBeacons",
		"stopEstimoteBeaconDiscovery",
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
EstimoteBeacons.prototype.startRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"startRangingBeaconsInRegion",
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
EstimoteBeacons.prototype.stopRangingBeaconsInRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"stopRangingBeaconsInRegion",
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
 *
 * See function startEstimoteBeaconsDiscoveryForRegion for region format.
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
EstimoteBeacons.prototype.startMonitoringForRegion = function (region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"startMonitoringForRegion",
		[region]
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
EstimoteBeacons.prototype.stopMonitoringForRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		"EstimoteBeacons",
		"stopMonitoringForRegion",
		[region]
	);

	return true;
};

/*
EstimoteBeacons.prototype.getBeaconByIdx = function (idx, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.getClosestBeacon = function (successCallback, errorCallback) {
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

EstimoteBeacons.prototype.getConnectedBeacon = function (successCallback, errorCallback) {
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

EstimoteBeacons.prototype.connectToBeacon = function (major, minor, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.connectToBeaconByMacAddress = function (macAddress, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.disconnectFromBeacon = function (successCallback, errorCallback) {
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

EstimoteBeacons.prototype.setAdvIntervalOfConnectedBeacon = function (advInterval, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.setPowerOfConnectedBeacon = function (power, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.updateFirmwareOfConnectedBeacon = function (progressCallback, successCallback, errorCallback) {
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

EstimoteBeacons.prototype.getBeacons = function (successCallback) {
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

EstimoteBeacons.prototype.startVirtualBeacon = function (major, minor, id, successCallback) {
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

EstimoteBeacons.prototype.stopVirtualBeacon = function(successCallback) {
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

var estimoteBeacons = new EstimoteBeacons();
module.exports = estimoteBeacons;
