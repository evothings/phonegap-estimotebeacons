# This plugin is no longer maintained - new maintainer is welcome!

Sadly we don't have the time to maintain this plugin. We recommend using the iBeacon plugin by Peter Metz, which works nicely with Estimote beacons. This plugin can be found here: https://github.com/petermetz/cordova-plugin-ibeacon

If you are interested in taking over maintanance/ownership of the plugin, please contact us at info@evothings.com

## About the Estimote Cordova/PhoneGap plugin

This plugin makes it easy to develop Cordova apps for Estimote Beacons and Estimote Stickers. Use JavaScript and HTML to develop stunning apps that take advantage of the capabilities of Estimote Beacons and Stickers.

![Estimote Beacons](http://evomedia.evothings.com/2014/09/estimote-beacons-group-small.jpg)

## Updated API

The JavaScript API has been updated. Please note that the new API is not backwards compatible. The original API is available in the branch "0.1.0".

As of version 0.6.0 the API consists of two modules, "estimote.beacons" and "estimote.nearables", with support for Estimote Beacons and Estimote Stickers. "EstimoteBeacons" is kept for backwards compatibility, and points to "estimote.beacons".

A change log is found in file [changelog.md](changelog.md).

## Beacon Finder example app

Try out the Beacon Finder example app, which is available in the examples folder in this repository. Find out more in the [README file](examples/beacon-finder/README.md) and look into the details of the [example source code](examples/beacon-finder/www/).

## How to create an app using the plugin

See the instructions in the Beacon Finder [README file](examples/beacon-finder/README.md).

## Documentation

The file [documentation.md](documentation.md) contains an overview of the plugin API.

Documentation of all functions is available in the JavaScript API implementation file [EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js).

## Credits

Many thanks goes to [Konrad Dzwinel](https://github.com/kdzwinel) who developed the original version of this plugin and provided valuable support and advice for the redesign of the plugin.

Many thanks also to all contributors! https://github.com/evothings/phonegap-estimotebeacons/pulls?q=is%3Apr+is%3Aclosed
