# Estimote Cordova/PhoneGap plugin

This plugin makes it easy to develop Cordova apps for Estimote Beacons and Estimote Stickers. Use JavaScript and HTML to develop stunning apps that take advantage of the capabilities of Estimote Beacons and Stickers.

You can also develop Cordova Beacon apps using the fast live reload workflow of Evothings Studio. Read on below to learn more.

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

Documentation of all functions is available in the JavaScript API implementation file [EstimoteBeacons.js](plugin/src/js/EstimoteBeacons.js). There is also [JSDoc generated documentation](http://evomedia.evothings.com/jsdoc/phonegap-estimotebeacons/) available.

## Develop beacon apps using live reload

You can use Evothings Workbench to develop beacon apps with a super-fast workflow, using live reload. When you save a file in your text editor, the app automatically reloads on connected phones and tablets (developing on multiple devices at the same time works just fine).

![Evothings Workbench](http://evomedia.evothings.com/2013/11/EvothingsWorkbenchEstimote.png)

The Beacon Finder example app has built-in support to connect to Evothings Workbench. Here is how to get started:

* [Download the Evothings Studio package](http://evothings.com/download/). The download contains Evothings Workbench, which is a live reload easy-to-use webserver that runs on your desktop/laptop computer.
* Launch Evothings Workbench.
* Clone/download this GitHub repository to your computer.
* Build and run the Beacon Finder example app.
* Select the "Live Coding" button in the app (on a small screen scroll to find the button).
* Enter the Connect URL found in the Evothings Workbench window, and select Connect.
* Open a file browser and locate the file: examples/beacon-finder/www/index.html
* Drag index.html to the Workbench.
* Click the RUN button in the Workbench
* The HTML/JS files of the app now loads from the webserver and therefore you can dynamically update the code without having to rebuild the entire Cordova app. This saves loads of time!
* You can use any text editor with the Workbench. Just edit source files and save, and the app will reload on connected phones and tablets.
* Free free to ask questions at the [Evothings Forum](http://evothings.com/forum/viewforum.php?f=11).

Evothings Studio has a mobile app called Evothings Client. This app is ready to use out-of-the-box with the Workbench, and has support for Estimote Beacons built in. However, since the Estimote Beacons Cordova plugin is currently being actively developed, the Evothings Client app available on the app stores lags behind the latest updates in this repo. Therefore it can be beneficial to use a freshly built Beacon Finder app with Evothings Workbench, instead of Evothings Client.

[Evothings Studio Starter Kit](http://evothings.com/evothings-studio-starter-kit/) contains more details about how to use the Workbench.

Learn everything about Evothings Studio and Estimote JavaScript app development in the [Estimote Starter Kit](http://evothings.com/estimote-starter-kit/).

Learn more about Cordova app development for the Internet of Things in the [Cordova IoT Starter Kit](http://evothings.com/estimote-starter-kit/).

## Credits

Many thanks goes to [Konrad Dzwinel](https://github.com/kdzwinel) who developed the original version of this plugin and provided valuable support and advice for the redesign of the plugin.
