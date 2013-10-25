var exec = require('cordova/exec');

/**
 * Helpers
 */
function isString(value) {
    return (typeof value == 'string' || value instanceof String);
}

function isInt(value) {
    return !isNaN(parseInt(value, 10)) && (parseFloat(value, 10) == parseInt(value, 10));
}

/**
 * Constructor
 */
function EstimoteBeacons() {
}

EstimoteBeacons.prototype.startEstimoteBeaconsDiscoveryForRegion = function (successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "startEstimoteBeaconsDiscoveryForRegion",
        []
    );
};

EstimoteBeacons.prototype.stopEstimoteBeaconsDiscoveryForRegion = function (successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.stopEstimoteBeaconsDiscoveryForRegion failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "stopEstimoteBeaconsDiscoveryForRegion",
        []
    );
};

EstimoteBeacons.prototype.startRangingBeaconsInRegion = function (successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.startRangingBeaconsInRegion failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "startRangingBeaconsInRegion",
        []
    );
};

EstimoteBeacons.prototype.stopRangingBeaconsInRegion = function (successCallback) {
    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.stopRangingBeaconsInRegion failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "stopRangingBeaconsInRegion",
        []
    );
};

EstimoteBeacons.prototype.startMonitoringForRegion = function (major, minor, id, successCallback) {
    if (!isInt(major)) {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: major must be a valid integer");
        return;
    }

    if (!isInt(minor)) {
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

    exec(successCallback,
        function () {
        },
        "EstimoteBeacons",
        "startMonitoringForRegion",
        [major, minor, id]
    );
};

EstimoteBeacons.prototype.stopMonitoringForRegion = function (id, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if(!isString(id)) {
        console.error("EstimoteBeacons.startMonitoringForRegion failure: id must be a string");
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

EstimoteBeacons.prototype.setFrequencyOfConnectedBeacon = function (frequency, successCallback, errorCallback) {
    if (errorCallback === null) {
        errorCallback = function () {
        }
    }

    if (!isInt(frequency)) {
        console.error("EstimoteBeacons.setFrequencyOfConnectedBeacon failure: frequency must be a valid integer");
        return;
    }

    if (typeof errorCallback !== "function") {
        console.error("EstimoteBeacons.setFrequencyOfConnectedBeacon failure: error callback parameter is not a function");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.setFrequencyOfConnectedBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        errorCallback,
        "EstimoteBeacons",
        "setFrequencyOfConnectedBeacon",
        [frequency]
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
        console.error("EstimoteBeacons.connectToBeacon failure: major must be a valid integer");
        return;
    }

    if (!isInt(minor)) {
        console.error("EstimoteBeacons.connectToBeacon failure: minor must be a valid integer");
        return;
    }

    if(!isString(id)) {
        console.error("EstimoteBeacons.connectToBeacon failure: id must be a string");
        return;
    }

    if (typeof successCallback !== "function") {
        console.error("EstimoteBeacons.connectToBeacon failure: success callback parameter must be a function");
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
        console.error("EstimoteBeacons.connectToBeacon failure: success callback parameter must be a function");
        return;
    }

    exec(successCallback,
        function(){},
        "EstimoteBeacons",
        "stopVirtualBeacon",
        []
    );
};

var estimoteBeacons = new EstimoteBeacons();
module.exports = estimoteBeacons;