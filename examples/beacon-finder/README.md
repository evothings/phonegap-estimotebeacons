Example application: Beacon Finder
========================
Beacon Finder shows a dynamic list of available beacons with approximate distances from the phone.

![Beacon finder in action](http://i.imgur.com/JhiMyvA.png)

## How to run it?

This app is based on default PhoneGap application. In order to run it please:
- create new PhoneGap application
- override (not replace!) default contents of `www` folder with files from this folder
- add iBeacons PhoneGap plugin
- `phonegap local build ios`
- run the app

## Problems?

If app isn't working, make sure that following text is present in your `config.xml`:

    <feature name="EstimoteBeacons">
        <param name="ios-package" value="EstimoteBeacons" />
        <param name="onload" value="true" />
    </feature>

It's not? Add it.

## Still not working?
Try the [troubleshooting guide](https://github.com/kdzwinel/phonegap-estimotebeacons/wiki/Troubleshooting-guide).
