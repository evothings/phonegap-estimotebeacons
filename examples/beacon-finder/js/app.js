// The app object is defined in a closure to make it easier to
// change its visible name, if that would be needed.
var app = (function()
{
	var app = {};

	app.deviceIsReady = false;
	app.currentScreenId = null;
	app.beaconColorStyles = [
		'style-color-unknown',
		'style-color-mint',
		'style-color-ice',
		'style-color-blueberry',
		'style-color-white',
		'style-color-transparent'];
	app.proximityNames = [
		'unknown',
		'immediate',
		'near',
		'far'];

	function onDeviceReady()
	{
		app.deviceIsReady = true;
	}

	function formatDistance(meters)
	{
		if (meters > 1)
		{
			return meters.toFixed(3) + ' m';
		}
		else
		{
			return (meters * 100).toFixed(3) + ' cm';
		}
	}

	function formatProximity(proximity)
	{
		// Eliminate bad values (just in case).
		proximity = Math.max(0, proximity);
		proximity = Math.min(3, proximity);

		// Return name for proximity.
		return app.proximityNames[proximity];
	}

	function beaconColorStyle(color)
	{
		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);

		// Return style class for color.
		return app.beaconColorStyles[color];
	}

	app.showScreen = function(screenId)
	{
		// Hide current screen if set.
		if (app.currentScreenId != null)
		{
			$('#' + app.currentScreenId).hide();
		}

		// Show new screen.
		app.currentScreenId = screenId;
		$('#' + app.currentScreenId).show();
		document.body.scrollTop = 0;
	};

	app.showHomeScreen = function()
	{
		app.showScreen('id-screen-home');
	};

	app.showScanScreen = function()
	{
		app.showScreen('id-screen-scan');
	};

	app.showRangeScreen = function()
	{
		app.showScreen('id-screen-range');
	};

	app.showMonitorScreen = function()
	{
		app.showScreen('id-screen-monitor');
	};

	app.startScanning = function()
	{
		app.showScanScreen();

		function onScan(beaconInfo)
		{
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage)
		{
			console.log('Scan error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo)
		{
			$('#id-screen-scan .style-beacon-list').empty();

			$.each(beaconInfo.beacons, function(key, beacon)
			{
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-scan .style-beacon-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
			var color = beaconColorStyle(beacon.color);
			htm = '<div class="' + color + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
				+ '</td></tr><tr><td>Measured power</td><td>' + beacon.measuredPower
				+ '</td></tr><tr><td>MAC address</td><td>' + beacon.macAddress
				+ '</td></tr></table></div>';
			return htm;
		};

		EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion(
			{}, // Empty region matches all beacons.
			onScan,
			onError);
	};

	app.stopScanning = function()
	{
		EstimoteBeacons.stopEstimoteBeaconDiscovery();
		app.showHomeScreen();
	};

	app.startRanging = function()
	{
		app.showRangeScreen();

		function onRange(beaconInfo)
		{
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage)
		{
			console.log('Range error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo)
		{
			$('#id-screen-range .style-beacon-list').empty();

			$.each(beaconInfo.beacons, function(key, beacon)
			{
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-range .style-beacon-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
			var color = beaconColorStyle(beacon.color);
			htm = '<div class="' + color + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
				+ '</td></tr><tr><td>Proximity</td><td>'
				+ formatProximity(beacon.proximity)
				+ '</td></tr><tr><td>Distance</td><td>'
				+ formatDistance(beacon.distance)
				+ '</td></tr></table></div>';
			return htm;
		};

		EstimoteBeacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons.
			onRange,
			onError);
	};

	app.stopRanging = function()
	{
		EstimoteBeacons.stopRangingBeaconsInRegion({});
		app.showHomeScreen();
	};

	app.startMonitoring = function()
	{
		app.showMonitorScreen();

		function onMonitor(regionState)
		{
			displayRegionInfo(regionState);
		}

		function onError(errorMessage)
		{
			console.log('Monitor error: ' + errorMessage);
		}

		// TODO: Handle multiple regions. Currently only
		// one region will be displayed.
		function displayRegionInfo(regionState)
		{
			$('#id-screen-monitor .style-beacon-list').empty();

			var element = $(createRegionStateHTML(regionState));
			$('#id-screen-monitor .style-beacon-list').append(element);
		};

		function createRegionStateHTML(regionState)
		{
			var color = 'style-color-pink';
			htm = '<div class="' + color + '">'
				+ '<table><tr><td>State</td><td>' + regionState.state
				+ '</td></tr><tr><td>Major</td><td>' + regionState.major
				+ '</td></tr><tr><td>Minor</td><td>' + regionState.minor
				+ '</td></tr><tr><td>Identifier</td><td>' + regionState.identifier
				+ '</td></tr><tr><td>UUID</td><td>' + regionState.uuid
				+ '</td></tr></table></div>';
			return htm;
		};

		EstimoteBeacons.startMonitoringForRegion(
			{}, // Empty region matches all beacons.
			onMonitor,
			onError);
	};

	app.stopMonitoring = function()
	{
		EstimoteBeacons.stopMonitoringForRegion({});
		app.showHomeScreen();
	};

	document.addEventListener('deviceready', onDeviceReady, false);

	app.showHomeScreen();

	return app;

})();
