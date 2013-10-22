var exec = require('cordova/exec');
/**
 * Constructor
 */
function EstimoteBeacons() {}

EstimoteBeacons.prototype.startEstimoteBeaconsDiscoveryForRegion = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "startEstimoteBeaconsDiscoveryForRegion",
        []
    );
};

EstimoteBeacons.prototype.stopEstimoteBeaconsDiscoveryForRegion = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "stopEstimoteBeaconsDiscoveryForRegion",
        []
    );
};

EstimoteBeacons.prototype.startRangingBeaconsInRegion = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "startRangingBeaconsInRegion",
        []
    );
};

EstimoteBeacons.prototype.stopRangingBeaconsInRegion = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "stopRangingBeaconsInRegion",
        []
    );
};

EstimoteBeacons.prototype.getBeaconByIdx = function(idx, callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "getBeaconByIdx",
        [idx]
    );
};

EstimoteBeacons.prototype.getClosestBeacon = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "getClosestBeacon",
        []
    );
};

EstimoteBeacons.prototype.getConnectedBeacon = function(callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "getConnectedBeacon",
        []
    );
};

EstimoteBeacons.prototype.connectToBeacon = function(major, minor, callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "connectToBeacon",
        [major, minor]
    );
};

EstimoteBeacons.prototype.connectToBeaconByMacAddress = function(macAddress, callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "connectToBeaconByMacAddress",
        [macAddress]
    );
};

EstimoteBeacons.prototype.disconnectFromBeacon = function(callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "disconnectFromBeacon",
        []
    );
};

EstimoteBeacons.prototype.setFrequencyOfConnectedBeacon = function(frequency, callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "setFrequencyOfConnectedBeacon",
        [frequency]
    );
};

EstimoteBeacons.prototype.setPowerOfConnectedBeacon = function(power, callback, errorCallback) {
    exec(callback,
        errorCallback || function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "setPowerOfConnectedBeacon",
        [power]
    );
};

EstimoteBeacons.prototype.updateFirmwareOfConnectedBeacon = function(progressCallback, successCallback, errorCallback) {
    var progressInterval;

    exec(function() {
            if(progressInterval) {
                clearInterval(progressInterval);
            }

            successCallback.apply(this, arguments);
        },
        function() {
            if(progressInterval) {
                clearInterval(progressInterval);
            }

            errorCallback.apply(this, arguments);
        },
        "EstimoteBeacons",
        "updateFirmwareOfConnectedBeacon",
        []
    );

    if(progressCallback) {
        progressInterval = setInterval(function() {
            exec(progressCallback,
                function(error){
                    console.error("Error", error);
                },
                "EstimoteBeacons",
                "getFirmwareUpdateProgress",
                []
            );
        }, 100);
    }
};

EstimoteBeacons.prototype.getBeacons = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "getBeacons",
        []
    );
};

var estimoteBeacons = new EstimoteBeacons();
module.exports = estimoteBeacons;