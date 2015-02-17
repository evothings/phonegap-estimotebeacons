# JavaScript API guide for the Estimote Beacons Cordova plugin

## Notice

The JS API has been updated and now consists of two modules ,"estimote.beacons" and "estimote.nearables", with support for Estimote Beacons and Estimote Stickers. "EstimoteBeacons" is kept for backwards compatibility, and points to "estimote.beacons".

See file [changelog.md](changelog.md) for a list of all updates.

## JavaScript API documentation

In addition to this document [JSDoc generated documentation](http://evomedia.evothings.com/jsdoc/phonegap-estimotebeacons/) is available. This is based on the documentation comments in file
[EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js)

## Basic usage

Beacon ranging example:

    estimote.beacons.startRangingBeaconsInRegion(
        {}, // Empty region matches all beacons.
        function(result) {
            console.log('*** Beacons ranged ***')
            estimote.beacons.printObject(result) },
        function(errorMessage) {
            console.log('Ranging error: ' + errorMessage) })

Stickers ranging example:

	estimote.nearables.startRangingForType(
		estimote.nearables.NearableTypeAll,
		function(nearables) {
            console.log('*** Stickers ranged ***')
            estimote.beacons.printObject(nearables) },
        function(errorMessage) {
            console.log('Ranging error: ' + errorMessage) })

## Overview of the JavaScript API

The plugin currently supports:

* Monitoring beacons (iOS and Android)
* Ranging for beacons (iOS and Android)
* Scanning for beacons using CoreBluetooth (iOS)
* Requesting authorization for ranging/monitoring beacons on iOS
* Ranging for nearables (Estimote Stickers) (iOS)
* Monitoring for nearables (Estimote Stickers) (iOS)
* Monitoring for nearable triggers (Estimote Stickers) (iOS)
* Using Secure Beacons (iOS)
* Calling ESTConfig methods (iOS)
* Using an iPhone as a Virtual Beacon (iOS)

Scanning is similar to ranging but uses a different underlying implementation than ranging does.

## Estimote Beacons API

### Start and stop monitoring beacons (iOS and Android)

    estimote.beacons.startMonitoringForRegion(
       region,
        successCallback,
        errorCallback)

    estimote.beacons.stopMonitoringForRegion(
        region,
        successCallback,
        errorCallback)

Example:

    function onMonitoringSuccess(regionState) {
        console.log('State is ' + regionState.state)
    }

    estimote.beacons.startMonitoringForRegion(
       region,
        onMonitoringSuccess,
        onError)

### Start and stop ranging beacons (iOS and Android)

    estimote.beacons.startRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

    estimote.beacons.stopRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

Example:

    function onRangingSuccess(beaconInfo) {
        console.log('Number of beacons ranged ' + beaconInfo.beacons.length)
    }

    estimote.beacons.startRangingBeaconsInRegion(
        {},
        onRangingSuccess,
        onError)

### Start and stop scanning beacons (iOS only)

    estimote.beacons.startEstimoteBeaconsDiscoveryForRegion(
        region,
        successCallback,
        errorCallback)

    estimote.beacons.stopEstimoteBeaconDiscovery(
        region,
        successCallback,
		errorCallback)

Example:

    function onDiscoverySuccess(beaconInfo) {
        console.log('Number of beacons discovered ' + beaconInfo.beacons.length)
    }

    estimote.beacons.startEstimoteBeaconsDiscoveryForRegion(
        {},
        onDiscoverySuccess,
        onError)

### Authorization (iOS 8 and above)

On iOS 8 your app should ask for permission to use location services (required for monitoring and ranging on iOS 8 - on Android and iOS 7 this function does nothing):

    estimote.beacons.requestAlwaysAuthorization(
        successCallback,
        errorCallback)

Note that this is not needed for the Nearables API (Estimote Stickers).

### How to access beacon data

When you use ranging or scanning, you have access to a variety of beacon properties. Different properties are available depending on whether ranging or scanning is used. (Note that during monitoring you don’t get data for individual beacons, rather you get data about regions entered and exited.)

### Beacon properties available on iOS

Properties available both during ranging and scanning:

* major - major value of the beacon
* minor - minor value of the beacon
* color - one of estimote.beacons.BeaconColorUnknown, estimote.beacons.BeaconColorMint, estimote.beacons.BeaconColorIce, estimote.beacons.BeaconColorBlueberry, estimote.beacons.BeaconColorWhite, estimote.beacons.BeaconColorTransparent
* rssi - number representing the Received Signal Strength Indication

Beacon properties available only when ranging:

* proximityUUID - UUID of the beacon
* distance - estimated distance from the beacon in meters
* proximity - one of estimote.beacons.ProximityUnknown, estimote.beacons.ProximityImmediate, estimote.beacons.ProximityNear, estimote.beacons.ProximityFar

Beacon properties available only when scanning:

* macAddress
* measuredPower

The full set of properties available on iOS are documented in the Estimote iOS SDK:
http://estimote.github.io/iOS-SDK/Classes/ESTBeacon.html

### Beacon properties available on Android

Beacon properties available when ranging:

* proximityUUID - UUID of the beacon
* major - major value of the beacon
* minor - minor value of the beacon
* rssi - number representing the Received Signal Strength Indication
* name - the name advertised by the beacon
* macAddress
* measuredPower

The properties available on Android are documented in the [Estimote Android SDK](http://estimote.github.io/Android-SDK/JavaDocs/index.html?com/estimote/sdk/Beacon.html)

### Beacon code example

Using the above data you can do all sorts of things, identify which beacons are close, how far they are, if they are close, and so on. Here is an example of how to access the beacon distance property:

    var region = { identifier: 'MyRegion' }

    estimote.beacons.startRangingBeaconsInRegion(
        region,
        onBeaconsRanged,
        onError)

    function onBeaconsRanged(beaconInfo)
    {
        // Sort beacons by distance.
        beaconInfo.beacons.sort(function(beacon1, beacon2) {
            return beacon1.distance > beacon2.distance })

        // Log distance for the closest beacon.
        var beacon = beaconInfo.beacons[0]
        console.log('Closest beacon is ' + beacon.distance + 'm away')
    }

    function onError(error)
    {
        console.log('Start ranging error: ' + error)
    }

### Secure Beacons (iOS)

You can use Estimote Secure Beacons from JavaScript.

Two steps are needed. First set the App ID and App Token. Second set the 'secure' property of the region you are using for monitoring/ranging to true.

Here is an example:

	// Step 1: Set App ID and App Token.
	estimote.beacons.setupAppIDAndAppToken('MyAppID', 'MyAppToken')

	// Step 2: Specify secure field in region object.
    var region = { identifier: 'MyRegion', secure: true }
    estimote.beacons.startRangingBeaconsInRegion(
        region,
        onBeaconsRanged,
        onError)

Read more about Secure Beacons in this article: https://community.estimote.com/hc/en-us/articles/204233603-How-security-feature-works

### Virtual Beacons (iOS)

A virtual beacon is an iOS device acting as an Estimote Beacon.

Here is how you turn your iPhone into a Beacon using the JavaScript API.

Function startAdvertisingAsBeacon starts advertising as a beacon:

    estimote.beacons.startAdvertisingAsBeacon(
        UUIDString
        majorValue,
        minorValue,
        regionName,
        successCallback,
        errorCallback)

Example that starts advertising:

    estimote.beacons.startAdvertisingAsBeacon(
        'B9407F30-F5F8-466E-AFF9-25556B57FE6D', // UUID
        1, // Major
        1, // Minor
        'MyRegion', // Region name (not visible?)
        function(result) {
            console.log('Beacon started') },
        function(errorMessage) {
            console.log('Error starting beacon: ' + errorMessage) })

Now you can run an Estimote Beacon scanning app on another device and your iPhone should be detected. Remember to use the same UUID when ranging/monitoring as the one used in the call to startAdvertisingAsBeacon.

Function stopAdvertisingAsBeacon stops advertising:

    estimote.beacons.stopAdvertisingAsBeacon(
        successCallback,
        errorCallback)

Here is an example:

    estimote.beacons.stopAdvertisingAsBeacon(
        function(result) {
            console.log('Beacon stopped') },
        function(errorMessage) {
            console.log('Error stopping beacon: ' + errorMessage) })

## Nearables API for iOS (Estimote Stickers)

### Start and stop ranging nearables (iOS only)

You can range for nearables by type:

    estimote.nearables.startRangingForType(
		estimote.nearables.NearableTypeAll,
        successCallback,
        errorCallback)

    estimote.nearables.stopRangingForType(
		estimote.nearables.NearableTypeAll,
        successCallback,
    	errorCallback)

Example successCallback function used when ranging for type (note that the callback gets an array of nearables):

    function successCallback(nearables) {
        console.log('Number of ranged nearables: ' + nearables.length) }

Or you can range for a specific beacon using the unique nearable identifier:

    estimote.nearables.startRangingForIdentifier(
		identifier,
        successCallback,
        errorCallback)

    estimote.nearables.stopRangingForIdentifier(
		identifier,
        successCallback,
    	errorCallback)

Example successCallback function used when ranging for identifier (note that the callback gets a single nearable):

    function successCallback(nearable) {
        console.log('Ranged nearable: ' + nearable.nameForType) }

Stop all ongoing nearable ranging:

    estimote.nearables.stopRanging()

### Nearable properties available when ranging

* type: number
* nameForType: string
* color: number
* nameForColor: string
* identifier: string
* hardwareVersion: string
* firmwareVersion: string
* rssi: number
* zone: number
* idleBatteryVoltage: number
* stressBatteryVoltage: number
* currentMotionStateDuration: number
* previousMotionStateDuration: number
* isMoving: bool
* orientation: number
* xAcceleration: number
* yAcceleration: number
* zAcceleration: number
* temperature: number
* power: number
* firmwareState: number

### Start and stop monitoring nearables (iOS only)

You can monitor for nearables by type:

    estimote.nearables.startMonitoringForType(
		estimote.nearables.NearableTypeDog,
        successCallback,
        errorCallback)

    estimote.nearables.stopMonitoringForType(
		estimote.nearables.NearableTypeDog,
        successCallback,
    	errorCallback)

Example successCallback function used when monitoring for type:

    function successCallback(state) {
        console.log('Type: ' + state.type + ' state: ' + state.state) }

Or you can monitor by the unique nearable identifier:

    estimote.nearables.startMonitoringForIdentifier(
		identifier,
        successCallback,
        errorCallback)

    estimote.nearables.stopMonitoringForIdentifier(
		identifier,
        successCallback,
    	errorCallback)

Example successCallback function used when monitoring for identifier:

    function successCallback(state) {
        console.log('Identifier: ' + state.identifier + ' state: ' + state.state) }

Stop all ongoing nearable monitoring:

    estimote.nearables.stopRanging()

### Using triggers with nearables (iOS only)

The Estimote trigger engine can be used to monitor for nearables using rules. In general, you use one rule for each nearable you wish to monitor. A trigger can contain one or more rules.

Each rule has en update function that is called by the trigger engine. The update function gets a nearable as a parameter and can inspect the properties of the nearable to determine if the rule holds true or not. The rule function should then call into the trigger engine and pass true or false to make the engine update the state for the trigger.

The actual trigger monitoring callback function is called when the trigger as a whole changes its state. The state is true if all rules hold, and false otherwise. The trigger callback is only called when the compound trigger state is changed. Update functions for individual rules are called continuously.

Here is a code example to give a taste of this style of coding. The trigger we monitor for tells us if our dos is moving or is still (assuming we have attached a Dog Sticker to our dog ;)

    // Called when trigger changes state.
    function onTriggerChangedState(trigger) {
        if (trigger.state)
            console.log('Dog is moving')
        else
            console.log('Dog is still')
    }

    // Called is case of error.
    function onTriggerError(errorMessage) {
        console.log('Trigger error: ' + errorMessage)
    }

    // Trigger rule.
    dogIsMovingRule = estimote.triggers.createRuleForNearable(
        estimote.nearables.NearableTypeDog,
        estimote.triggers.rules.nearableIsMoving())

    // Trigger.
    trigger = estimote.triggers.createTrigger('DogTrigger', [dogIsMovingRule])

    // Start monitoring for trigger.
    estimote.triggers.startMonitoringForTrigger(
        trigger,
        onTriggerChangedState,
        onTriggerError)

And here is how to stop monitoring a trigger:

    estimote.triggers.stopMonitoringForTrigger(trigger)
