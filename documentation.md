# JavaScript API guide for the Estimote Beacons Cordova plugin

## Notice

The JS API has been updated and now consists of two modules ,"estimote.beacons" and "estimote.nearables", with support for Estimote Beacons and Estimote Stickers. "EstimoteBeacons" is kept for backwards compatibility, and points to "estimote.beacons".

See file [changelog.md](changelog.md) for a list of all updates.

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
		estimote.nearables.ESTNearableTypeAll,
		function(nearables) {
            console.log('*** Stickers ranged ***')
            estimote.beacons.printObject(nearables) },
        function(errorMessage) {
            console.log('Ranging error: ' + errorMessage) })

## Overview of the Estimote Beacons JavaScript API

The plugin currently supports:

* Monitoring beacons (iOS and Android)
* Ranging for beacons (iOS and Android)
* Scanning for beacons using CoreBluetooth (iOS)
* Ranging for nearables (Estimote Stickers)  (iOS)

Scanning is similar to ranging but uses a different underlying implementation than ranging does.

### Start and stop monitoring beacons (iOS and Android)

    estimote.beacons.startMonitoringForRegion(
       region,
        successCallback,
        errorCallback)

    estimote.beacons.stopMonitoringForRegion(
        region,
        successCallback,
        errorCallback)

### Start and stop ranging beacons (iOS and Android)

    estimote.beacons.startRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

    estimote.beacons.stopRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

### Start and stop scanning beacons (iOS only)

    estimote.beacons.startEstimoteBeaconsDiscoveryForRegion(
        region,
        successCallback,
        errorCallback)

    estimote.beacons.stopEstimoteBeaconDiscovery(
        region,
        successCallback,
		errorCallback)

### Start and stop ranging nearables (iOS only)

    estimote.nearables.startRangingForType(
		estimote.nearables.ESTNearableTypeAll,
        successCallback,
        errorCallback)

    estimote.nearables.stopRangingForType(
		estimote.nearables.ESTNearableTypeAll,
        successCallback,
    	errorCallback)

	// Stop all ongoing nearable ranging
    estimote.nearables.stopRanging()

### iOS 8 considerations

On iOS 8 your app should ask for permission to use location services (required for monitoring and ranging on iOS 8 - on Android and iOS 7 this function does nothing):

    estimote.beacons.requestAlwaysAuthorization(
        successCallback,
        errorCallback)

Note that this is not needed for the Nearables API (Estimote Stickers).

## How to access beacon data

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

### Nearable properties available on iOS

* type: number
* nameForType: string
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
* txPower: number
* channel: number
* firmwareState: number

## Beacon code example

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

## Learn more

Full documentation of available functions is available in the JavaScript API implementation file:
[EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js)
