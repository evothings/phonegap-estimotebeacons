var exec = require('cordova/exec');

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

function checkExecParamsRegionSuccessFail(region, success, fail)
{
	var caller = checkExecParamsRegionSuccessFail.caller.name

    if (typeof region != "object") {
        console.error("Error: region parameter is not an object in: " + caller);
        return false;
    }

    if (typeof success != "function") {
        console.error("Error: success parameter is not a function in: " + caller);
        return false;
    }

    if (typeof fail != "function") {
        console.error("Error: fail parameter is not a function in: " + caller);
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
 * Print an object. Use for debugging. Example calls:
 *   EstimoteBeacons.printObject(obj);
 *   EstimoteBeacons.printObject(obj, console.log);
 */
EstimoteBeacons.prototype.printObject = function(obj, printFun)
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

/**
 * Start scanning for beacons using CoreBluetooth.
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are detected (mandatory).
 * @param fail Function called on error (mandatory).
 */
EstimoteBeacons.prototype.startEstimoteBeaconsDiscoveryForRegion = function (region, success, fail)
{
    if (!checkExecParamsRegionSuccessFail(region, success, fail)) {
        return false;
    }

    exec(success,
        fail,
        "EstimoteBeacons",
        "startEstimoteBeaconsDiscoveryForRegion",
        [region]
    );

    return true;
};

/**
 * Stop CoreBluetooth scan.
 * @param success Function called when beacons are detected (non-mandatory).
 * @param fail Function called on error (non-mandatory).
 */
EstimoteBeacons.prototype.stopEstimoteBeaconDiscovery = function (success, fail)
{
    exec(success,
        fail,
        "EstimoteBeacons",
        "stopEstimoteBeaconDiscovery",
        []
    );

    return true;
};

/**
 * Start ranging beacons using CoreLocation.
 * @param region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are ranged (mandatory).
 * @param fail Function called on error (mandatory).
 */
EstimoteBeacons.prototype.startRangingBeaconsInRegion = function (region, success, fail)
{
    if (!checkExecParamsRegionSuccessFail(region, success, fail)) {
        return false;
    }

    exec(success,
        fail,
        "EstimoteBeacons",
        "startRangingBeaconsInRegion",
        [region]
    );

    return true;
};

/**
 * Stop ranging beacons using CoreLocation.
 * @param region Dictionary with region properties (mandatory).
 *   Not implemented: If the region is empty, ranging for all active regions will stop.
 * @param success Function called when beacons are ranged (non-mandatory).
 * @param fail Function called on error (non-mandatory).
 */
EstimoteBeacons.prototype.stopRangingBeaconsInRegion = function (region, success, fail)
{
    if (!checkExecParamsRegion(region)) {
        return false;
    }

    exec(success,
        fail,
        "EstimoteBeacons",
        "stopRangingBeaconsInRegion",
        [region]
    );

    return true;
};

/*

EstimoteBeacons.prototype.startMonitoringForRegion = function (id, majorOrCallback, minorOrCallback, successCallback, errorCallback, notifyEntryStateOnDisplay) {
    var major = (typeof majorOrCallback === 'function') ? null : majorOrCallback;
    var minor = (typeof minorOrCallback === 'function') ? null : minorOrCallback;
    successCallback = (typeof majorOrCallback === 'function') ? majorOrCallback : successCallback;
    errorCallback = (typeof minorOrCallback === 'function') ? minorOrCallback : errorCallback;
    var notify = (notifyEntryStateOnDisplay === true) ? true : false;

    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (major !== null && !isInt(major)) {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: major must be a valid integer");
        return;
    }

    if (minor !== null && !isInt(minor)) {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: minor must be a valid integer");
        return;
    }

    if(!isString(id)) {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: id must be a string");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: success callback parameter must be a function");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: error callback parameter is not a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "startMonitoringForRegion",
        [id, major, minor, notify]
    );
};

EstimoteBeacons.prototype.stopMonitoringForRegion = function (id, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if(!isString(id)) {
        console.error("EstimoteBeacons.stopMonitoringForRegion failure: id must be a string");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.stopMonitoringForRegion failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.stopMonitoringForRegion failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "stopMonitoringForRegion",
        [id]
    );
};

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
