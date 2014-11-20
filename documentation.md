# JavaScript API guide for the Estimote Beacons Cordova plugin

## Basic usage

Ranging example:

    EstimoteBeacons.startRangingBeaconsInRegion(
        {}, // Empty region matches all beacons.
        function(result) {
            console.log('*** Beacons ranged ***')
            EstimoteBeacons.printObject(result) },
        function(errorMessage) {
            console.log('Ranging error: ' + errorMessage) })

## Overview of the Estimote Beacons JavaScript API

The plugin currently supports:

* Monitoring beacons (iOS and Android)
* Ranging for beacons (iOS and Android)
* Scanning for beacons using CoreBluetooth (iOS only)

Scanning is similar to ranging but uses a different underlying implementation than ranging does.

### Start and stop monitoring (iOS and Android)

    EstimoteBeacons.startMonitoringForRegion(
       region,
        successCallback,
        errorCallback)

    EstimoteBeacons.stopMonitoringForRegion(
        region,
        successCallback,
        errorCallback)

### Start and stop ranging (iOS and Android)

    EstimoteBeacons.startRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

    EstimoteBeacons.stopRangingBeaconsInRegion(
        region,
        successCallback,
        errorCallback)

### Start and stop scanning (iOS only)

    EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion(
        region,
        successCallback,
        errorCallback)

    EstimoteBeacons.stopEstimoteBeaconDiscovery(
        region,
        successCallback,
    errorCallback)

### iOS 8 considerations

On iOS 8 your app should ask for permission to use location services (required for monitoring and ranging - on Android and iOS 7 this does nothing):

    EstimoteBeacons.requestAlwaysAuthorization(
        successCallback,
        errorCallback)

For iOS 8, also remember to update your Info.plist file with usage descriptions for locations services, see article [Estimote SDK and iOS 8 Location Services](https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services) for further details.

## How to access beacon data

When you use ranging or scanning, you have access to a variety of beacon properties. Different properties are available depending on whether ranging or scanning is used. (Note that during monitoring you don’t get data for individual beacons, rather you get data about regions entered and exited.)

### Properties available on iOS

Properties available both during ranging and scanning:

* major - major value of the beacon
* minor - minor value of the beacon
* color - one of EstimoteBeacons.BeaconColorUnknown, EstimoteBeacons.BeaconColorMint, EstimoteBeacons.BeaconColorIce, EstimoteBeacons.BeaconColorBlueberry, EstimoteBeacons.BeaconColorWhite, EstimoteBeacons.BeaconColorTransparent
* rssi - number representing the Received Signal Strength Indication

Properties available only when ranging:

* proximityUUID - UUID of the beacon
* distance - estimated distance from the beacon in meters
* proximity - one of EstimoteBeacons.ProximityUnknown, EstimoteBeacons.ProximityImmediate, EstimoteBeacons.ProximityNear, EstimoteBeacons.ProximityFar

Properties available only when scanning:

* macAddress
* measuredPower

The full set of properties available on iOS are documented in the Estimote iOS SDK:
http://estimote.github.io/iOS-SDK/Classes/ESTBeacon.html

### Properties available on Android

Properties available when ranging:

* proximityUUID - UUID of the beacon
* major - major value of the beacon
* minor - minor value of the beacon
* rssi - number representing the Received Signal Strength Indication
* name - the name advertised by the beacon
* macAddress
* measuredPower

The properties available on Android are documented in the [Estimote Android SDK](http://estimote.github.io/Android-SDK/JavaDocs/index.html?com/estimote/sdk/Beacon.html)

## Code example

Using the above data you can do all sorts of things, identify which beacons are close, how far they are, if they are close, and so on. Here is an example of how to access the beacon distance property:

    var region = { identifier: 'MyRegion' }

    EstimoteBeacons.startRangingBeaconsInRegion(
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
