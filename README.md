# Estimote Beacons Cordova/PhoneGap plugin

* Wrapper around Estimote iOS SDK (https://github.com/Estimote/iOS-SDK)
* Supports Estimote SDK 2.1.5
* Currently scanning, ranging and monitoring is implemented
* Connecting to beacons and and reading/writing data is planned to be implemented as the next step

## Updated API

The JavaScript API has been updated. Please note that the new API is not backwards compatible. The original API is available in the branch "0.1.0".

## Example app

Try out the Beacon Finder example app. It is available in the examples folder in this repository.

![Beacon Finder screenshot](examples/beacon-finder/beacon-finder-screenshot.png)

Check out the [README file](examples/beacon-finder/README.md) and the example source code for additional details.

## How to create an app using the plugin

See the instructions in the Beacon Finder example app [README file](examples/beacon-finder/README.md).

## Note about plugin.xml and plugin directory structure

Because the way Cordova plugin folders are structured, there are two versions of plugin.xml, one in the root directory and one in the `plugin` directory.

The plugin.xml in the `plugin` folder is there to make it possible to build the example app without moving the example app directory out of the root directory. This is needed because of how the `cordova plugin add` command works (it does not work to install a plugin for an app located in a subdirectory of the directory where plugin.xml is located). A cleaner long-term solution could be to use a separate repository for the example app.

To build the example app, reference the plugin directory when adding the plugin. Otherwise Cordova will fail to add it. Instructions are given in the example app [README file](examples/beacon-finder/README.md).

When installing the plugin from GitHub with the following command, the plugin.xml file in the root directly is used:

    cordova plugin add https://github.com/evothings/phonegap-estimotebeacons.git

## Documentation

The file [documentation.md](documentation.md) contains an overview of the plugin API.

Full documentation of available functions is available in the JavaScript API implementation file:
[EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js)







