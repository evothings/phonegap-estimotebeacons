# Estimote Beacons Cordova/PhoneGap plugin

* Supports scanning, ranging and monitoring of Estimote Beacons, and ranging of Estimote Stickers
* Connecting to beacons and and reading/writing data is planned to be implemented as the next step

## Updated API

The JavaScript API has been updated. Please note that the new API is not backwards compatible. The original API is available in the branch "0.1.0".

As of version 0.6.0 the API consists of two modules, "estimote.beacons" and "estimote.nearables", with support for Estimote Beacons and Estimote Stickers. "EstimoteBeacons" is kept for backwards compatibility, and points to "estimote.beacons".

A change log is found in file [changelog.md](changelog.md).

## Example app

Try out the Beacon Finder example app. It is available in the examples folder in this repository.

![Beacon Finder screenshot](examples/beacon-finder/beacon-finder-screenshot.png)

Check out the [README file](examples/beacon-finder/README.md) and the example source code for additional details.

## How to create an app using the plugin

See the instructions in the Beacon Finder example app [README file](examples/beacon-finder/README.md).

## Documentation

The file [documentation.md](documentation.md) contains an overview of the plugin API.

Full documentation of available functions is available in the JavaScript API implementation file:
[EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js)

## Credits

Many thanks goes to [Konrad Dzwinel](https://github.com/kdzwinel) who developed the original version of this plugin and provided valuable support and advise for the redesign the plugin.
