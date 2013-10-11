# Example of a native iOS plugin for using PhoneGap 3.0.

[PhoneGap 3.0 introduces](http://phonegap.com/blog/2013/07/19/adobe-phonegap-3.0-released/) a new plugin architecture. With this release any custom plugin can be installed 
by using [PhoneGap's CLI](https://github.com/mwbrooks/phonegap-cli) or [Cordova Plugman](https://github.com/apache/cordova-plugman/). 

For a better understanding of the changes of PhoneGap 3.0 this repository provides a very simple native iOS plugin.

## Screen shot

[![screen shot](https://raw.github.com/sectore/phonegap3-native-ios-plugin/master/assets/phonegap3-native-ios-plugin-screenshot.png)](https://github.com/sectore/phonegap3-native-ios-plugin)

## Installation

- Make sure that you have [Node](http://nodejs.org/) and [PhoneGap CLI](https://github.com/mwbrooks/phonegap-cli) installed on your machine.

- Create your PhoneGap example app

```bash
phonegap create my-plugin-example-app && cd $_
```

- Add the plugin to it

```bash
phonegap local plugin add https://github.com/sectore/phonegap3-native-ios-plugin
```

- Open `index.html and add a button

```html
<button onclick="myPlugin.sayHello();">Say hello to your plugin!</button>
```

- Register plugin within `config.xml` of your app

```xml
<feature name="MyPlugin">
    <param name="ios-package" value="MyPlugin" />
</feature>
```

- Build and run app

```bash
phonegap run ios
```

## Author
Jens Krause // [WEBSECTOR.DE](http://www.websector.de)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sectore/phonegap3-native-ios-plugin/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

