var exec = require('cordova/exec');
/**
 * Constructor
 */
function EstimoteBeacons() {}

EstimoteBeacons.prototype.getClosestBeaconDistance = function(callback) {
    exec(callback,
        function(error){
            console.error("Error", error);
        },
        "EstimoteBeacons",
        "getClosestBeaconDistance",
        []
    );
};

var estimoteBeacons = new EstimoteBeacons();
module.exports = estimoteBeacons;