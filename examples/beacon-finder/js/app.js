// The app object is defined in a closure to make it easier to
// change its visible name, if that would be needed.
var app = (function()
{
	var app = {};

	app.deviceIsReady = false;
	app.currentScreenId = null;
	app.beaconColorStyles = [
		'style-color-unknown style-color-unknown-text',
		'style-color-mint style-color-mint-text',
		'style-color-ice style-color-ice-text',
		'style-color-blueberry-dark style-color-blueberry-dark-text',
		'style-color-white style-color-white-text',
		'style-color-transparent style-color-transparent-text'];
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
		if(color === undefined)
			color = 0;

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
			console.log('onScan');
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage)
		{
			console.log('Scan error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo)
		{
			console.log('displayBeconInfo');
			// Clear beacon HTML items.
			$('#id-screen-scan .style-beacon-list').empty();

			// Sort beacons by signal strength.
			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.rssi > beacon2.rssi; });

			// Generate HTML for beacons.
			var html = '';
			$.each(beaconInfo.beacons, function(key, beacon)
			{
				/*	// jQuery doesn't work.
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-scan .style-beacon-list').append(element);
				*/
				html += createBeaconHTML(beacon);
			});
			var list = document.getElementById('id-screen-scan-list');
			list.innerHtml = html;
			console.log('added to: '+list);
		};

		function createBeaconHTML(beacon)
		{
			console.log('beacon: '+beacon.major+' '+beacon.minor+', '+beacon.rssi+' ('+beacon.measuredPower+')');
			var colorClasses = beaconColorStyle(beacon.color);
			htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
				+ '</td></tr><tr><td>Measured power</td><td>' + beacon.measuredPower
				+ '</td></tr><tr><td>MAC address</td><td>' + beacon.macAddress
				+ '</td></tr></table></div>';
			return htm;
		};

		console.log("startEstimoteBeaconsDiscoveryForRegion")
		EstimoteBeacons.startEstimoteBeaconsDiscoveryForRegion(
			{}, // Empty region matches all beacons.
			onScan,
			onError);
	};

	app.stopScanning = function()
	{
		console.log("stopEstimoteBeaconDiscovery")
		EstimoteBeacons.stopEstimoteBeaconDiscovery();
		app.showHomeScreen();
	};

	app.startRanging = function()
	{
		app.showRangeScreen();

		function onRange(beaconInfo)
		{
			console.log('onRange');
			displayBeconInfo(beaconInfo);
		}

		function onError(errorMessage)
		{
			console.log('Range error: ' + errorMessage);
		}

		function displayBeconInfo(beaconInfo)
		{
			// Clear beacon HTML items.
			$('#id-screen-range .style-beacon-list').empty();

			// Sort beacons by distance.
			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.distance > beacon2.distance; });

			// Generate HTML for beacons.
			$.each(beaconInfo.beacons, function(key, beacon)
			{
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-range .style-beacon-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
			var colorClasses = beaconColorStyle(beacon.color);
			htm = '<div class="' + colorClasses + '">'
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
