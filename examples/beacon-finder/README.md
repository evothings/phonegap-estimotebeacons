# Example application: Beacon Finder

Beacon Finder is an example app that finds and displays beacons.

## Discovery methods

There are three methods of discovery:

* Scanning - beacon data (distance not available, uses CoreBluetooth discovery)
* Ranging - beacon data including distance (uses CoreLocation ranging)
* Monitoring - region data (uses CoreLocation monitoring)

Different data are available depending on the method used. Monitoring displays region data.

## Screenshot

![Beacon Finder screenshot](beacon-finder-screenshot.png)

## How to run it?

This app is meant to be built using Cordova or PhoneGap.

TODO: Add build instructions.
