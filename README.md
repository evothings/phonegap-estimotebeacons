# Estimote Beacons Cordova/PhoneGap plugin

* Wrapper around Estimote iOS SDK (https://github.com/Estimote/iOS-SDK)
* Supports Estimote SDK 2.1.5
* Currently scanning, ranging and monitoring is implemented
* Connecting to beacons and and reading/writing data is planned to be implemented as the next step

## Example app

Try out the Beacon Finder example app. It is available in the examples folder in this repository.

![Beacon Finder screenshot](examples/beacon-finder/beacon-finder-screenshot.png)

Check out the [README file](https://github.com/divineprog/phonegap-estimotebeacons/blob/master/examples/beacon-finder/README.md) and the example source code for additional details.

## How to create an app using the plugin

TODO: Add build instructions.

## Basic usage

Ranging example:

    EstimoteBeacons.startRangingBeaconsInRegion(
        {}, // Empty region matches all beacons.
        function(result) {
            console.log('*** Beacons ranged ***')
            EstimoteBeacons.printObject(result) },
        function(errorMessage) {
            console.log('Ranging error: ' + errorMessage) })

## Documentation

Documentation of available functions and their use are found in file:
[EstimoteBeacons.js](https://github.com/divineprog/phonegap-estimotebeacons/blob/master/www/EstimoteBeacons.js)

(A more readable documentation is planned! Sorry for the inconvenience.)

For iOS 8, please remember to update your Info.plist file with usage descriptions for locations services, see article [Estimote SDK and iOS 8 Location Services](https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services) for further details.


