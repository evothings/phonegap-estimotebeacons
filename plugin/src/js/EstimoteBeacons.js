//
// Use jsdoc to generate documentation.
//
// Install JSDoc on OS X (specify the actual JSDoc version you wish to use):
//
// sudo npm install -g jsdoc@"<=3.3.0"
//
// To install latest development version:
//
// sudo npm install -g git+https://github.com/jsdoc3/jsdoc.git
//
// JSDoc home page:
//
// https://github.com/jsdoc3/jsdoc
//
// Install the DocStrap template engine:
//
// sudo npm install -g ink-docstrap
//
// Run JSDoc to generate documentation (use the actual path of your
// DocStrap installation):
//
// jsdoc -c ./conf.json -t /usr/local/lib/node_modules/ink-docstrap/template
//
// File conf.json contains JSDoc/DocStrap settings you can tweak.
//
// To eliminate the duplicated titles in the generated documentation,
// insert this CSS into site.yeti.css (this is a temporary hack):
//
// /* Hide duplicated header titles. */
//  #main h1:nth-child(2) {
//      display: none;
//  }
//

var exec = cordova.require('cordova/exec');

/*********************************************************/
/***************** Estimote Namespaces *******************/
/*********************************************************/

/****
 * NOT USED - generated documentation is not correct.
 * Module name. This is just used for the documentation.
 * You never use this name in your code.
 * @module EstimotePlugin
 */

/**
 * Main exported module.
 * @namespace estimote
 */
var estimote = estimote || {};

// Export module.
module.exports = estimote;

/**
 * Submodule for beacons.
 * @namespace beacons
 * @memberof estimote
 */
estimote.beacons = estimote.beacons || {};

/**
 * Namespace alias for estimote.beacons, for backwards compatibility.
 * Deprecated, use {@link estimote.beacons}
 * @deprecated
 * @global
 */
window.EstimoteBeacons = estimote.beacons;

/**
 * Submodule for nearables (stickers).
 * @namespace nearables
 * @memberof estimote
 */
estimote.nearables = estimote.nearables || {};

/**
 * Submodule for triggers.
 * @namespace triggers
 * @memberof estimote
 */
estimote.triggers = estimote.triggers || {};

/**
 * Submodule for trigger rules.
 * @namespace rules
 * @memberof estimote.triggers
 */
estimote.triggers.rules = estimote.triggers.rules || {};

/*********************************************************/
/****************** Debugging Functions ******************/
/*********************************************************/

/**
 * Print an object. Useful for debugging.
 * @param {object} obj Object to print.
 * @param {function} [printFun=console.log] Print function, defaults to console.log (optional).
 * @example Example calls:
 *   estimote.printObject(obj);
 *   estimote.printObject(obj, console.log);
 * @function estimote.printObject
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
/************** Generic Bluetooth Functions **************/
/*********************************************************/

/**
 * Ask for the Bluetooth state. Implemented on iOS.
 * If Bluetooth is off, this call initially displays a
 * dialog to the user in addition to returning the value
 * false to the success callback.
 * @todo Is there a way to make the dialog not show?
 *
 * @param {function} [success] Function called on success.
 * Takes a boolean parameter. Format success(boolean).
 * If true Bluetooth is on, if false it is off.
 * @param {ErrorCallback} [error] Function called on error.
 *
 * @example
 * estimote.bluetoothState(
 *   function(result) {
 *      console.log('Bluetooth state: ' + result) },
 *   function(errorMessage) {
 *      console.log('Error: ' + errorMessage) })
 */
estimote.bluetoothState = function(success, error)
{
	exec(success,
		error,
		'EstimoteBeacons',
		'bluetooth_bluetoothState',
		[]
	);

	return true;
};

/*********************************************************/
/*************** Basic Callback Functions ****************/
/*********************************************************/

/**
 * Success callback function that takes no parameters.
 * @callback SuccessCallbackNoParams
 */

/**
 * Error callback function.
 * @callback ErrorCallback
 * @param {string} error Error message.
 */

/*********************************************************/
/**************** Estimote Beacons Module ****************/
/*********************************************************/

/**
 * For backwards compatibility. Use {@link estimote.printObject}
 * @deprecated
 * @memberof estimote.beacons
 */
estimote.beacons.printObject = estimote.printObject

/**
 * Proximity value.
 */
estimote.beacons.ProximityUnknown = 0;

/**
 * Proximity value.
 */
estimote.beacons.ProximityImmediate = 1;

/**
 * Proximity value.
 */
estimote.beacons.ProximityNear = 2;

/**
 * Proximity value.
 */
estimote.beacons.ProximityFar = 3;

/**
 * Beacon colour.
 * @memberof estimote.beacons
 */
estimote.beacons.BeaconColorUnknown = 0;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorMintCocktail = 1;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorIcyMarshmallow = 2;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorBlueberryPie = 3;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorSweetBeetroot = 4;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorCandyFloss = 5;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorLemonTart = 6;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorVanillaJello = 7;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorLiquoriceSwirl = 8;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorWhite = 9;

/**
 * Beacon colour.
 */
estimote.beacons.BeaconColorTransparent = 10;

/**
 * Region state.
 */
estimote.beacons.RegionStateUnknown = 'unknown';

/**
 * Region state.
 */
estimote.beacons.RegionStateOutside = 'outside';

/**
 * Region state.
 */
estimote.beacons.RegionStateInside = 'inside';

/**
 * Ask the user for permission to use location services
 * while the app is in the foreground.
 * You need to call this function or requestAlwaysAuthorization
 * on iOS 8+.
 * Does nothing on other platforms.
 *
 * @param {SuccessCallbackNoParams} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example call:
 *   estimote.beacons.requestWhenInUseAuthorization()
 *
 * @see {@link https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services|Estimote SDK and iOS 8 Location Services}
 */
estimote.beacons.requestWhenInUseAuthorization = function(success, error)
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
 * @param {SuccessCallbackNoParams} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example call:
 *   estimote.beacons.requestAlwaysAuthorization()
 *
 * @see {@link https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services|Estimote SDK and iOS 8 Location Services}
 */
estimote.beacons.requestAlwaysAuthorization = function(success, error)
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
 * @param {function} success Function called on success, the result param of the
 * function contains the current authorization status (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(authorizationStatus)
 *
 * @example Example call:
 *   estimote.beacons.authorizationStatus(
 *     function(result) {
 *       console.log('Location authorization status: ' + result) },
 *     function(errorMessage) {
 *       console.log('Error: ' + errorMessage) })
 *
 * @see {@link https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services|Estimote SDK and iOS 8 Location Services}
 */
estimote.beacons.authorizationStatus = function(success, error)
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
 * @param {string} uuid UUID string the beacon should advertise (mandatory).
 * @param {number} major Major value to advertise (mandatory).
 * @param {number} minor Minor value to advertise (mandatory).
 * @param {string} regionId Identifier of the region used to advertise (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that starts advertising:
 *   estimote.beacons.startAdvertisingAsBeacon(
 *     'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
 *     1,
 *     1,
 *     'MyRegion',
 *     function() {
 *       console.log('Beacon started') },
 *     function(errorMessage) {
 *       console.log('Error starting beacon: ' + errorMessage) })
 */
estimote.beacons.startAdvertisingAsBeacon = function(
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
 * @param {SuccessCallbackNoParams} success Function called on success (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example Example that stops advertising:
 *   estimote.beacons.stopAdvertisingAsBeacon(
 *     function(result) {
 *       console.log('Beacon stopped') },
 *     function(errorMessage) {
 *       console.log('Error stopping beacon: ' + errorMessage) })
 */
estimote.beacons.stopAdvertisingAsBeacon = function(success, error)
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
 * Enable analytics.
 *
 * @see {@link http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html|Further details}
 *
 * @param {boolean} enable Boolean value to turn analytics on or off (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example call that enables analytics:
 *   estimote.beacons.enableAnalytics(true)
 */
estimote.beacons.enableAnalytics = function(enable, success, error)
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
 * Test if analytics is enabled.
 *
 * @see {@link http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html|Further details}
 *
 * @param {boolean} enable Boolean value to turn analytics on or off (mandatory).
 * @param {function} success Function called on success, the callback parameter contains a the enabled value as a boolean (mandatory).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example success callback format:
 *   success(enabled)
 *
 * @example Example that displays analytics enabled value:
 *   estimote.beacons.isAnalyticsEnabled(function(enabled) {
 *      console.log('Analytics enabled: ' + enabled) })
 */
estimote.beacons.isAnalyticsEnabled = function(success, error)
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
 * Test if App ID and App Token is set.
 *
 * @see {@link http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html|Further details}
 *
 * @param {boolean} enable Boolean value to turn analytics on or off (mandatory).
 * @param {function} success Function called on success, the callback parameter contains a the isAuthorized value as a boolean (mandatory).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example success callback format:
 *   success(isAuthorized)
 *
 * @example Example that displays the authorisation value:
 *   estimote.beacons.isAuthorized(function(isAuthorized) {
 *      console.log('App ID and App Token is set: ' + isAuthorized) })
 */
estimote.beacons.isAuthorized = function(success, error)
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
 * Set App ID and App Token.
 *
 * @see {@link http://estimote.github.io/iOS-SDK/Classes/ESTConfig.html|Further details}
 *
 * @param {string} appID The App ID (mandatory).
 * @param {string} appToken The App Token (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that sets App ID and App Token:
 *   estimote.beacons.setupAppIDAndAppToken('MyAppID', 'MyAppToken')
 */
estimote.beacons.setupAppIDAndAppToken = function(appID, appToken, success, error)
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
 * Beacon region object.
 * @typedef {Object} BeaconRegion
 * @property {string} identifier Region identifier
 * (id set by the application, not related actual beacons).
 * @property {string} uuid The UUID of the region.
 * @property {number} major The UUID major value of the region.
 * @property {number} major The UUID minor value of the region.
 */

/**
 * Beacon info object. Consists of a region and an array of beacons.
 * @typedef {Object} BeaconInfo
 * @property {BeaconRegion} region Beacon region. Not available when scanning on iOS.
 * @property {Beacon[]} beacons Array of {@link Beacon} objects.
 */

/**
 * Beacon object. Different properties are available depending on
 * platform (iOS/Android) and whether scanning (iOS) or ranging (iOS/Android).
 * @typedef {Object} Beacon
 * @property {number} major Major value of the beacon (ranging/scanning iOS/Android).
 * @property {number} color One of the estimote.beacons.BeaconColor* values (ranging/scanning iOS/Android).
 * @property {number} rssi - The Received Signal Strength Indication (ranging/scanning, iOS/Android).
 * @property {string} proximityUUID - UUID of the beacon (ranging iOS/Android)
 * @property {number} proximity One of estimote.beacons.Proximity* values (ranging iOS).
 * @property {string} macAddress (scanning iOS, ranging Android).
 * @property {number} measuredPower (scanning iOS, ranging Android).
 * @property {string} name The name advertised by the beacon (ranging Android).
 * @property {number} distance Estimated distance from the beacon in meters (ranging iOS).
 */

/**
 * Region state object. This object is given as a result when
 * monitoring for beacons.
 * @typedef {Object} RegionState
 * @property {string} identifier Region identifier
 * (id set by the application, not related actual beacons).
 * @property {string} uuid The UUID of the region.
 * @property {number} major The UUID major value of the region.
 * @property {number} major The UUID minor value of the region.
 * @property {string} state One of
 * {@link estimote.beacons.RegionStateInside},
 * {@link estimote.beacons.RegionStateOutside},
 * {@link estimote.beacons.RegionStateUnknown}.
 */

/**
 * Start scanning for all nearby beacons using CoreBluetooth (no region object is used).
 * Available on iOS.
 *
 * @param {function} success Function called when beacons are detected,
 * takes a {@link BeaconInfo} object as parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(BeaconInfo)
 *
 * @example Example that prints all discovered beacons and properties:
 *   estimote.beacons.startEstimoteBeaconDiscovery(
 *     function(info) {
 *       console.log('Beacons discovered:')
 *       estimote.printObject(info) },
 *     function(errorMessage) {
 *       console.log('Discovery error: ' + errorMessage) })
 */
estimote.beacons.startEstimoteBeaconDiscovery = function(success, error)
{	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startEstimoteBeaconDiscovery',
		[]
	);

	return true;
};

/**
 * Stop CoreBluetooth scan. Available on iOS.
 *
 * @param {SuccessCallbackNoParams} [success] Function called when
 * beacons are detected (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops discovery:
 *   estimote.beacons.stopEstimoteBeaconDiscovery()
 */
estimote.beacons.stopEstimoteBeaconDiscovery = function(success, error)
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
 * Start ranging beacons. Available on iOS and Android.
 *
 * @param {BeaconRegion} region Dictionary with region properties (mandatory).
 * @param {function} success Function called when beacons are ranged,
 * takes a {@link BeaconInfo} object as parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example callback format:
 *   success(BeaconInfo)
 *
 * @example Example that prints all beacons and properties:
 *   estimote.beacons.startRangingBeaconsInRegion(
 *     {}, // Empty region matches all beacons.
 *     function(info) {
 *       console.log('Beacons ranged:')
 *       estimote.printObject(info) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) })
 */
estimote.beacons.startRangingBeaconsInRegion = function(region, success, error)
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
 * Stop ranging beacons. Available on iOS and Android.
 *
 * @param {BeaconRegion} region Dictionary with region properties (mandatory).
 * @param {ErrorCallbackNoParams} [success] Function called when ranging
 * is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops ranging:
 *   estimote.beacons.stopRangingBeaconsInRegion({})
 */
estimote.beacons.stopRangingBeaconsInRegion = function(region, success, error)
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
 * Start ranging secure beacons. Available on iOS.
 * This function has the same parameters/behaviour as
 * {@link estimote.beacons.startRangingBeaconsInRegion}.
 * To use secure beacons set the App ID and App Token using
 * {@link estimote.beacons.setupAppIDAndAppToken}.
 */
estimote.beacons.startRangingSecureBeaconsInRegion = function(region, success, error)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startRangingSecureBeaconsInRegion',
		[region]
	);

	return true;
};

/**
 * Stop ranging secure beacons. Available on iOS.
 * This function has the same parameters/behaviour as
 * {@link estimote.beacons.stopRangingBeaconsInRegion}.
 */
estimote.beacons.stopRangingSecureBeaconsInRegion = function(region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopRangingSecureBeaconsInRegion',
		[region]
	);

	return true;
};

/**
 * Start monitoring beacons. Available on iOS and Android.
 *
 * @param {BeaconRegion} region Dictionary with region properties (mandatory).
 * @param success Function called when beacons are enter/exit the region (mandatory).
 * @param {function} success Function called when beacons enter/exit the region,
 * takes a {@link RegionState} object as parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 * @param {boolean} [notifyEntryStateOnDisplay=false] Set to true to detect if you
 * are inside a region when the user turns display on, see
 * {@link https://developer.apple.com/library/prerelease/ios/documentation/CoreLocation/Reference/CLBeaconRegion_class/index.html#//apple_ref/occ/instp/CLBeaconRegion/notifyEntryStateOnDisplay|iOS documentation}
 * for further details (optional, defaults to false, iOS only).
 *
 * @example success callback format:
 *   success(RegionState)
 *
 * @example Example that prints regionState properties:
 *   estimote.beacons.startMonitoringForRegion(
 *     {}, // Empty region matches all beacons.
 *     function(state) {
 *       console.log('Region state:')
 *       estimote.printObject(state) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) })
 */
estimote.beacons.startMonitoringForRegion = function(
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
 * Stop monitoring beacons. Available on iOS and Android.
 *
 * @param {BeaconRegion} region Dictionary with region properties (mandatory).
 * @param {ErrorCallbackNoParams} [success] Function called when monitoring
 * is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops monitoring:
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

/**
 * Start monitoring secure beacons. Available on iOS.
 * This function has the same parameters/behaviour as
 * estimote.beacons.startMonitoringForRegion.
 * To use secure beacons set the App ID and App Token using
 * {@link estimote.beacons.setupAppIDAndAppToken}.
 * @see {@link estimote.beacons.startMonitoringForRegion}
 */
estimote.beacons.startSecureMonitoringForRegion = function(
	region, success, error, notifyEntryStateOnDisplay)
{
	if (!checkExecParamsRegionSuccessError(region, success, error)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_startSecureMonitoringForRegion',
		[region, !!notifyEntryStateOnDisplay]
	);

	return true;
};


/**
 * Stop monitoring secure beacons. Available on iOS.
 * This function has the same parameters/behaviour as
 * {@link estimote.beacons.stopMonitoringForRegion}.
 */
estimote.beacons.stopSecureMonitoringForRegion = function (region, success, error)
{
	if (!checkExecParamsRegion(region)) {
		return false;
	}

	exec(success,
		error,
		'EstimoteBeacons',
		'beacons_stopSecureMonitoringForRegion',
		[region]
	);

	return true;
};

/**
 * Connect to Estimote Beacon. Available on Android.
 *
 * @param {Beacon} beacon Beacon to connect to.
 * @param {ErrorCallbackNoParams} [success] Function called when monitoring
 * is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that connects with MAC address:
 *   estimote.beacons.connectToBeacon(FF:0F:F0:00:F0:00);
 * @example Example that connects with BeaconRegion:
 *   estimote.beacons.connectToBeacon({
 *     proximityUUID: '000000FF-F00F-0FF0-F000-000FF0F00000',
 *     major: 1,
 *     minor: 1
 *   });
 */
estimote.beacons.connectToBeacon = function (beacon, success, error)
{
  if (typeof beacon !== 'object') {
    return false;
  }

  exec(success,
    error,
    'EstimoteBeacons',
    'beacons_connectToBeacon',
    [beacon]
  );

	return true;
};

/**
 * Disconnect from connected Estimote Beacon. Available on Android.
 *
 * @param {ErrorCallbackNoParams} [success] Function called when beacon
 * disconnection request has been init'ed.
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that disconnects from beacon:
 *   estimote.beacons.disconnectConnectedBeacon();
 */
estimote.beacons.disconnectConnectedBeacon = function (success, error)
{
  exec(success,
    error,
    'EstimoteBeacons',
    'beacons_disconnectConnectedBeacon',
    []
  );

  return true;
};

/**
 * Write proximity UUID to connected Estimote Beacon. Available on Android.
 *
 * @param {String} uuid String to write as new UUID
 * @param {ErrorCallbackNoParams} [success] Function called when beacon
 * disconnection request has been init'ed.
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that writes constant ESTIMOTE_PROXIMITY_UUID:
 *   estimote.beacons.writeConnectedProximityUUID(ESTIMOTE_PROXIMITY_UUID);
 */
estimote.beacons.writeConnectedProximityUUID = function (uuid, success, error) {
  exec(success,
    error,
    'EstimoteBeacons',
    'beacons_writeConnectedProximityUUID',

    // force lowercase because some uuidgen's have poor email etiquette
    [uuid.toLowerCase()]
  );
};

/**
 * Write major to connected Estimote Beacon. Available on Android.
 *
 * @param {Number} major Integer to write as new major
 * @param {ErrorCallbackNoParams} [success] Function called when beacon
 * disconnection request has been init'ed.
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that writes 1:
 *   estimote.beacons.writeConnectedMajor(1);
 */
estimote.beacons.writeConnectedMajor = function (major, success, error) {
  exec(success,
    error,
    'EstimoteBeacons',
    'beacons_writeConnectedMajor',
    [major]
  );
};

/**
 * Write minor to connected Estimote Beacon. Available on Android.
 *
 * @param {Number} minor Integer to write as new minor
 * @param {ErrorCallbackNoParams} [success] Function called when beacon
 * disconnection request has been init'ed.
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that writes 1:
 *   estimote.beacons.writeConnectedMinor(1);
 */
estimote.beacons.writeConnectedMinor = function (minor, success, error) {
  exec(success,
    error,
    'EstimoteBeacons',
    'beacons_writeConnectedMinor',
    [minor]
  );
};

/*********************************************************/
/*************** Estimote Nearables Module ***************/
/*********************************************************/

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeUnknown = 0;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeDog = 1;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeCar = 2;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeFridge = 3;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeBag = 4;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeBike = 5;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeChair = 6;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeBed = 7;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeDoor = 8;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeShoe = 9;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeGeneric = 10;

/**
 * Nearable type.
 */
estimote.nearables.NearableTypeAll = 11;

/**
 * Nearable zone.
 */
estimote.nearables.NearableZoneUnknown = 0;

/**
 * Nearable zone.
 */
estimote.nearables.NearableZoneImmediate = 1;

/**
 * Nearable zone.
 */
estimote.nearables.NearableZoneNear = 2;

/**
 * Nearable zone.
 */
estimote.nearables.NearableZoneFar = 3;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationUnknown = 0;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationHorizontal = 1;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationHorizontalUpsideDown = 2;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationVertical = 3;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationVerticalUpsideDown = 4;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationLeftSide = 5;

/**
 * Nearable orientation.
 */
estimote.nearables.NearableOrientationRightSide = 6;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorUnknown = 0;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorMintCocktail = 1;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorIcyMarshmallow = 2;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorBlueberryPie = 3;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorSweetBeetroot = 4;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorCandyFloss = 5;

/**
 * Nearable colour.
 */
estimote.nearables.NearableColorLemonTart = 6;

/**
 * Nearable object.
 * @typedef {Object} Nearable
 * @property {string} identifier Unique device identifier.
 * @property {number} type Nearable type value.
 * @property {string} nameForType Nearable type name.
 * @property {number} color Nearable color value.
 * @property {string} nameForColor Nearable color name.
 * @property {string} hardwareVersion Revision of nearable hardware.
 * @property {string} firmwareVersion Version of nearable firmware.
 * @property {number} rssi Bluetooth signal strength. It can take
 * value from -100 to 0. 127 value means RSSI reading error.
 * @property {number} zone Zone indicating distance from the device.
 * @property {number} idleBatteryVoltage Battery voltage when
 * nearable is in idle state defined in Volts.
 * @property {number} stressBatteryVoltage Battery voltage when
 * nearable is under stress (sending packet) defined in Volts.
 * @property {number} currentMotionStateDuration Time since last change
 * of motion state (isMoving value change) returned in seconds.
 * @property {number} previousMotionStateDuration Time of
 * previous motion state returned in seconds.
 * @property {boolean} isMoving Flag indicates if nearable is moving or not.
 * @property {number} orientation Physical orientation of nearable in space.
 * @property {number} xAcceleration X axis acceleration data.
 * @property {number} yAcceleration Y axis acceleration data.
 * @property {number} zAcceleration Z axis acceleration data.
 * @property {number} temperature Ambient temperature of nearable.
 * @property {number} power The power of the radio signal in dBm.
 * @property {number} firmwareState Indicates if nearable is in Boot or App state.
 *
 * @see {@link http://estimote.github.io/iOS-SDK/Classes/ESTNearable.html|Detailed specification of Nearable properties}
 */

/**
 * Identifier region state object.
 * @typedef {Object} IdentifierRegionState
 * @property {string} identifier Nearable identifier.
 * @property {string} state One of 'outside', 'inside'.
 */

/**
 * Type region state object.
 * @typedef {Object} TypeRegionState
 * @property {number} type One of the
 * estimote.nearable.NearableType* constants.
 * @property {string} state One of 'outside', 'inside'.
 */

/**
 * Start ranging for nearables with the given identifier. Available on iOS.
 *
 * @param {string} identifier Nearable identifier (mandatory).
 * @param {function} success Function called when the nearable with the
 * given id is ranged, called with a {@link Nearable} as parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(Nearable)
 *
 * @example Example that prints ranged nearable:
 *   estimote.nearables.startRangingForIdentifier(
 *     '7d42563606f7fc76',
 *     function(nearable) {
 *       console.log('Nearable ranged:')
 *       estimote.printObject(nearable) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) })
 */
estimote.nearables.startRangingForIdentifier = function(identifier, success, error)
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
 * Stop ranging for nearables with the given identifier. Available on iOS.
 *
 * @param {string} identifier String with nearable id (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called
 * when ranging is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops ranging:
 *   estimote.nearables.stopRangingForIdentifier(identifier)
 */
estimote.nearables.stopRangingForIdentifier = function(identifier, success, error)
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
 * Start ranging for nearables of the given type. Available on iOS.
 *
 * @param {number} type Nearable type, one of the
 * estimote.nearable.NearableType* constants (mandatory).
 * @param {function} success Function called when the nearable with the
 * given type is ranged, takes an array of {@link Nearable} as
 * parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(Nearable[])
 *
 * @example Example that prints all ranged nearables:
 *   estimote.nearables.startRangingForType(
 *     estimote.nearables.NearableTypeAll,
 *     function(nearables) {
 *       console.log('Number of nearables ranged: ' + nearables.length)
 *       estimote.printObject(nearables) },
 *     function(errorMessage) {
 *       console.log('Ranging error: ' + errorMessage) })
 */
estimote.nearables.startRangingForType = function(type, success, error)
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
 * Stop ranging for nearables of the given type. Available on iOS.
 *
 * @param {number} type Nearable type, one of the
 * estimote.nearable.NearableType* constants (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called when
 * ranging is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops ranging:
 *   estimote.nearables.stopRangingForType(estimote.nearables.NearableTypeAll)
 */
estimote.nearables.stopRangingForType = function(type, success, error)
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
 * Stop ranging all nearables. Available on iOS.
 *
 * @param {SuccessCallbackNoParams} [success] Function called when
 * ranging is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops ranging:
 *   estimote.nearables.stopRanging()
 */
estimote.nearables.stopRanging = function(success, error)
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
 * Start monitoring for nearables with the given identifier. Available on iOS.
 *
 * @param {string} identifier Nearable identifier to monitor for (mandatory).
 * @param {function} success Function called when the nearable with the
 * given identifier is monitored, called with a {@link IdentifierRegionState}
 * as parameter (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(IdentifierRegionState)
 *
 * @example Example that prints state for monitored identifier:
 *   estimote.nearables.startMonitoringForIdentifier(
 *     '7d42563606f7fc76',
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
 * Stop monitoring for nearables with the given identifier. Available on iOS.
 *
 * @param {string} identifier Nearable identifier to stop monitor (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called
 * when monitoring is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops monitoring:
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
 * Start monitoring for nearables of the given type. Available on iOS.
 *
 * @param {number} type Nearable type, one of the
 * estimote.nearables.NearableType* constants (mandatory).
 * @param {function} success Function called when nearables with the given
 * type is monitored, called with a parameter {@link TypeRegionState} (mandatory).
 * @param {ErrorCallback} error Function called on error (mandatory).
 *
 * @example success callback format:
 *   success(TypeRegionState)
 *
 * @example  Example that prints state for monitored type:
 *   estimote.nearables.startMonitoringForType(
 *     estimote.nearables.NearableTypeAll,
 *     function(state) {
 *       console.log('Nearables monitored:')
 *       estimote.printObject(state) },
 *     function(errorMessage) {
 *       console.log('Monitoring error: ' + errorMessage) })
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
 * Stop monitoring for nearables of the given type. Available on iOS.
 *
 * @param {number} type Nearable type, one of the
 * estimote.nearables.NearableType* constants (mandatory).
 * @param {SuccessCallbackNoParams} [success] Function called when
 * monitoring is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops monitoring:
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
 * Stop monitoring all nearables. Available on iOS.
 *
 * @param {SuccessCallbackNoParams} [success] Function called when
 * monitoring is stopped (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example that stops monitoring:
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
/*********************** Triggers ************************/
/*********************************************************/

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeGeneric = 1;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeNearableIdentifier = 2;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeNearableType = 3;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeInRangeOfNearableIdentifier = 4;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeInRangeOfNearableType = 5;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeOutsideRangeOfNearableIdentifier = 6;

/**
 * Trigger rule type.
 * @private
 */
estimote.triggers.RuleTypeOutsideRangeOfNearableType = 7;

/**
 * Trigger object.
 * @typedef {Object} Trigger
 * @property {boolean} state Is true if the trigger holds, false if not.
 */

/**
 * Trigger rule object.
 * @typedef {Object} TriggerRule
 * @property {boolean} state Set to true or false to set rule state.
 */

/**
 * Used for generating rule ids.
 * @private
 */
var ruleCounter = 0;

/**
 * Helper function that creates an internal 'lightweight'
 * trigger object sent to the native side.
 * @private
 */
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

/**
 * Helper function that calls the update function of the rule
 * related to the event and then updates the native rule state.
 * @private
 */
function helper_updateTriggerRule(trigger, event)
{
	var rule = trigger.ruleTable[event.ruleIdentifier];
	if (rule && rule.ruleUpdateFunction)
	{
		rule.ruleUpdateFunction(rule, event.nearable, event);
		helper_updateRuleState(
			event.triggerIdentifier,
			event.ruleIdentifier,
			rule.state);
	}
}

/**
 * Helper function used to update the state of a native rule
 * during an update event.
 * @param event Event object passed to the event update function.
 * @param state true if rule holds, false if rule does not hold.
 * @private
 */
function helper_updateRuleState(triggerIdentifier, ruleIdentifier, state)
{
	exec(null,
		null,
		'EstimoteBeacons',
		'triggers_updateRuleState',
		[triggerIdentifier, ruleIdentifier, state]
	);
}

// For interactive debugging.
//window.helper_updateRuleState = helper_updateRuleState;

/**
 * Create a trigger object. Available on iOS.
 *
 * @param {string} triggerIdentifier String that uniquely identifies
 * the trigger. You can choose any identifiers as long as they are unique
 * within the application.
 * @param {TriggerRule[]} Array of rule objects that will be used by the trigger.
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
 * Create a basic rule object. Available on iOS.
 *
 * @param {function} ruleUpdateFunction Function that is called
 * when the rule state should be updated. Specify your rule logic
 * in this function. Takes a {@link TriggerRule} as parameter.
 * To update rule state, set the rule.state field to true or false.
 *
 * @returns {TriggerRule} Rule object.
 *
 * @example Update callback function format:
 *   ruleUpdateFunction(TriggerRule)
 */
estimote.triggers.createRule = function(ruleUpdateFunction)
{
	var rule = {};
	rule.state = false;
	rule.ruleType = estimote.triggers.RuleTypeGeneric;
	rule.ruleUpdateFunction = ruleUpdateFunction;
	rule.ruleIdentifier = 'Rule' + (++ruleCounter);
	return rule;
};

/**
 * Create a rule object for a nearable. Available on iOS.
 *
 * @param {string|number} nearableIdentifierOrType A nearable
 * identifier or type.
 * This specifies the nearable that will be monitoried
 * by the rule.
 * @param {function} ruleUpdateFunction Function that is called
 * when the rule state should be updated. Specify your rule logic
 * in this function.
 * Takes a {@link TriggerRule} and a {@link Nearable} as parameters.
 * Note that the Nearable param can be undefined.
 * To update rule state, set the rule.state field to true or false.
 *
 * @returns {TriggerRule} Rule object.
 *
 * @example Update callback function format:
 *   ruleUpdateFunction(TriggerRule, Nearable)
 *
 * @example Rule creation for dog that moves:
 *   var rule = estimote.triggers.createRuleForNearable(
 *       estimote.nearables.NearableTypeDog,
 *       estimote.triggers.rules.nearableIsMoving())
 */
estimote.triggers.createRuleForNearable = function(
	nearableIdentifierOrType, ruleUpdateFunction)
{
	var rule = estimote.triggers.createRule(ruleUpdateFunction);

	if (typeof nearableIdentifierOrType == 'string')
	{
		rule.ruleType = estimote.triggers.RuleTypeNearableIdentifier;
		rule.nearableIdentifier = nearableIdentifierOrType;
	}
	else if (typeof nearableIdentifierOrType == 'number')
	{
		rule.ruleType = estimote.triggers.RuleTypeNearableType;
		rule.nearableType = nearableIdentifierOrType;
	}
	else
	{
		return null;
	}

	return rule;
};

/**
 * Create in range rule for nearable. Available on iOS.
 *
 * @param {string|number} nearableIdentifierOrType A nearable
 * identifier or type.
 * This specifies the nearable that will be monitoried
 * by the rule.
 *
 * @example
 *   var rule = estimote.triggers.createRuleForInRangeOfNearable(
 *       estimote.nearables.NearableTypeDog)
 */
estimote.triggers.createRuleForInRangeOfNearable = function(nearableIdentifierOrType)
{
	var rule = estimote.triggers.createRuleForNearable(
		nearableIdentifierOrType,
		null);

	if (typeof nearableIdentifierOrType == 'string')
	{
		rule.ruleType = estimote.triggers.RuleTypeInRangeOfNearableIdentifier;
		rule.nearableIdentifier = nearableIdentifierOrType;
	}
	else if (typeof nearableIdentifierOrType == 'number')
	{
		rule.ruleType = estimote.triggers.RuleTypeInRangeOfNearableType;
		rule.nearableType = nearableIdentifierOrType;
	}

	return rule;
};

/**
 * Create out of range rule for nearable type. Available on iOS.
 *
 * @param {string|number} nearableIdentifierOrType A nearable
 * identifier or type.
 * This specifies the nearable that will be monitoried
 * by the rule.
 *
 * @example
 *   var rule = estimote.triggers.createRuleForOutsideRangeOfNearable(
 *       estimote.nearables.NearableTypeDog)
 */
estimote.triggers.createRuleForOutsideRangeOfNearable = function(nearableIdentifierOrType)
{
	var rule = estimote.triggers.createRuleForNearable(
		nearableIdentifierOrType,
		null);

	if (typeof nearableIdentifierOrType == 'string')
	{
		rule.ruleType = estimote.triggers.RuleTypeOutsideRangeOfNearableIdentifier;
		rule.nearableIdentifier = nearableIdentifierOrType;
	}
	else if (typeof nearableIdentifierOrType == 'number')
	{
		rule.ruleType = estimote.triggers.RuleTypeOutsideRangeOfNearableType;
		rule.nearableType = nearableIdentifierOrType;
	}

	return rule;
};

/**
 * Start monitoring a trigger. Available on iOS.
 *
 * @param {Trigger} trigger Trigger object to monitor.
 * @param {function} triggerCallback Function called when the trigger
 * changes state. The callback takes the {@link Trigger} as parameter.
 * trigger.state contains the current state of the trigger, it is true
 * if the trigger holds, false if not.
 * @param {ErrorCallback} errorCallback Function called on error.
 *
 * @example Format for triggerCallback:
 *   triggerCallback(Trigger)
 *
 * @example Code example:
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
 *   // Rule function. The nearable param can
 *   // be undefined so we check for this.
 *   function nearableIsMoving(rule, nearable) {
 *       rule.state = nearable && nearable.isMoving
 *   }
 *
 *   // Trigger rule.
 *   var dogIsMovingRule = estimote.triggers.createRuleForType(
 *       estimote.nearables.NearableTypeDog,
 *       nearableIsMoving)
 *
 *	 // Trigger.
 *   var trigger = estimote.triggers.createTrigger(
 *       'DogIsMovingTrigger', [dogIsMovingRule])
 *
 *   // Start monitoring for trigger.
 *   estimote.triggers.startMonitoringForTrigger(
 *       trigger,
 *       onTriggerChangedState,
 *       onTriggerError)
 */
estimote.triggers.startMonitoringForTrigger = function(
	trigger, triggerCallback, errorCallback)
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
 * Stop monitoring a trigger. Available on iOS.
 *
 * @param {Trigger} trigger Trigger to stop monitoring.
 * @param {SuccessCallback} [success] Function called on success (optional).
 * @param {ErrorCallback} [error] Function called on error (optional).
 *
 * @example Example call:
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

/*********************************************************/
/**************** Trigger Rule Functions *****************/
/*********************************************************/

/**
 * Rule creation function. Available on iOS.
 */
estimote.triggers.rules.nearableIsMoving = function()
{
	return function(rule, nearable) {
		rule.state = nearable && nearable.isMoving;
	};
};

/**
 * Rule creation function. Available on iOS.
 */
estimote.triggers.rules.nearableIsNotMoving = function()
{
	return function(rule, nearable) {
		rule.state = nearable && !nearable.isMoving;
	};
};

/**
 * Rule creation function. Monitor a temperature span. Available on iOS.
 * @param low Min temperature of span to detect.
 * @param high Max temperature of span to detect.
 */
estimote.triggers.rules.nearableTemperatureBetween = function(low, high)
{
	return function(rule, nearable) {
		rule.state =
			nearable &&
			(nearable.temperature >= low) &&
			(nearable.temperature <= high);
	};
};

/**
 * Rule creation function. Monitor a temperature. Available on iOS.
 * @param temp Rule triggers when nearable reads below this temperature.
 */
estimote.triggers.rules.nearableTemperatureLowerThan = function(temp)
{
	return function(rule, nearable) {
		rule.state =
			nearable &&
			(nearable.temperature < temp);
	};
};

/**
 * Rule creation function. Monitor a temperature. Available on iOS.
 * @param temp Rule triggers when nearable reads above this temperature.
 */
estimote.triggers.rules.nearableTemperatureGreaterThan = function(temp)
{
	return function(rule, nearable) {
	console.log('nearable.temperature :' + nearable.temperature)
		rule.state =
			nearable &&
			(nearable.temperature > temp);
	};
};

/**
 * Rule creation function. Available on iOS.
 */
estimote.triggers.rules.nearableIsClose = function()
{
	return function(rule, nearable, event)
	{
		if (!nearable)
		{
			// Nearable is undefined and out of range.
			rule.state = false;
			return;
		}

		// We track values where the nerable is not close.
		// If we get more than five of them in a row the nearble
		// is not considered close anymore.

		if (!rule.notCloseTracker) { rule.notCloseTracker = 0; }

		if (nearable.zone != estimote.nearables.NearableZoneImmediate &&
			nearable.zone != estimote.nearables.NearableZoneNear)
		{
			++rule.notCloseTracker;
		}
		else
		{
			rule.notCloseTracker = 0;
		}

		rule.state = rule.notCloseTracker < 5;
	};
};

/**
 * Rule creation function. Available on iOS.
 */
estimote.triggers.rules.nearableIsInRange = function()
{
	return function(rule, nearable, event)
	{
		if (!nearable)
		{
			// Nearable is undefined and out of range.
			rule.state = false;
			return;
		}

		// We track values where the nerable is not in range.
		// If we get more than five of them in a row the nearble
		// is not considered in range any more.

		if (!rule.notInRangeTracker) { rule.notInRangeTracker = 0; }

		if (nearable.zone == estimote.nearables.NearableZoneUnknown)
		{
			++rule.notInRangeTracker;
		}
		else
		{
			rule.notInRangeTracker = 0;
		}

		rule.state = rule.notInRangeTracker < 5;
	};
};

/*********************************************************/
/******************* Helper Functions ********************/
/*********************************************************/

/**
 * Internal helper function.
 * @private
 */
function isString(value)
{
	return (typeof value == 'string' || value instanceof String);
}

/**
 * Internal helper function.
 * @private
 */
function isInt(value)
{
	return !isNaN(parseInt(value, 10)) &&
		(parseFloat(value, 10) == parseInt(value, 10));
}

/**
 * Internal helper function.
 * @private
 */
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

/**
 * Internal helper function.
 * @private
 */
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

/**
 * Internal helper function.
 * @private
 */
function checkExecParamsRegion(region)
{
	var caller = checkExecParamsRegion.caller.name

	if (typeof region != 'object') {
		console.error('Error: region parameter is not an object in: ' + caller);
		return false;
	}

	return true;
}
