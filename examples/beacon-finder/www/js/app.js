// The app object is defined in a closure to make it easier to
// change its visible name, if that would be needed.
var app = (function()
{
	// Application object.
	var app = {};

	// Application data.
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

	// ------------- Private helper functions ------------- //

	function onDeviceReady()
	{
		// TODO: Add functionality if needed.
	}

	function formatDistance(meters)
	{
		if (!meters) { return 'Unknown'; }

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
		if (!proximity) { return 'Unknown'; }

		// Eliminate bad values (just in case).
		proximity = Math.max(0, proximity);
		proximity = Math.min(3, proximity);

		// Return name for proximity.
		return app.proximityNames[proximity];
	}

	function beaconColorStyle(color)
	{
		if (!color)
		{
			color = 0;
		}

		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);

		// Return style class for color.
		return app.beaconColorStyles[color];
	}

	// ------------- Public application functions ------------- //

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

	app.showScanBeaconsScreen = function()
	{
		app.showScreen('id-screen-scan-beacons');
	};

	app.showRangeBeaconsScreen = function()
	{
		app.showScreen('id-screen-range-beacons');
	};

	app.showMonitorRegionsScreen = function()
	{
		app.showScreen('id-screen-monitor-regions');
	};

	app.showRangeNearablesScreen = function()
	{
		app.showScreen('id-screen-range-nearables');
	};

	app.startScanningBeacons = function()
	{
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
			// Clear beacon HTML items.
			$('#id-screen-scan-beacons .style-beacon-list').empty();

			// Sort beacons by signal strength.
			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.rssi > beacon2.rssi; });

			// Generate HTML for beacons.
			var html = '';
			$.each(beaconInfo.beacons, function(key, beacon)
			{
				// jQuery doesn't work.
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-scan-beacons .style-beacon-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
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

		app.showScanBeaconsScreen();

		estimote.beacons.startEstimoteBeaconsDiscoveryForRegion(
			{}, // Empty region matches all beacons.
			onScan,
			onError);
	};

	app.stopScanningBeacons = function()
	{
		estimote.beacons.stopEstimoteBeaconDiscovery();
		app.showHomeScreen();
	};

	app.startRangingBeacons = function()
	{
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
			// Clear beacon HTML items.
			$('#id-screen-range-beacons .style-beacon-list').empty();

			// Sort beacons by distance.
			beaconInfo.beacons.sort(function(beacon1, beacon2) {
				return beacon1.distance > beacon2.distance; });

			// Generate HTML for beacons.
			$.each(beaconInfo.beacons, function(key, beacon)
			{
				var element = $(createBeaconHTML(beacon));
				$('#id-screen-range-beacons .style-beacon-list').append(element);
			});
		};

		function createBeaconHTML(beacon)
		{
			var colorClasses = beaconColorStyle(beacon.color);
			htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Major</td><td>' + beacon.major
				+ '</td></tr><tr><td>Minor</td><td>' + beacon.minor
				+ '</td></tr><tr><td>RSSI</td><td>' + beacon.rssi
			if (beacon.proximity)
			{
				htm += '</td></tr><tr><td>Proximity</td><td>'
					+ formatProximity(beacon.proximity)
			}
			if (beacon.distance)
			{
				htm += '</td></tr><tr><td>Distance</td><td>'
					+ formatDistance(beacon.distance)
			}
			htm += '</td></tr></table></div>';
			return htm;
		};

		app.showRangeBeaconsScreen();

		estimote.beacons.requestAlwaysAuthorization();

		estimote.beacons.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons.
			onRange,
			onError);
	};

	app.stopRangingBeacons = function()
	{
		estimote.beacons.stopRangingBeaconsInRegion({});
		app.showHomeScreen();
	};

	app.startMonitoringRegions = function()
	{
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
			$('#id-screen-monitor-regions .style-beacon-list').empty();

			var element = $(createRegionStateHTML(regionState));
			$('#id-screen-monitor-regions .style-beacon-list').append(element);
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

		app.showMonitorRegionsScreen();

		estimote.beacons.requestAlwaysAuthorization();

		estimote.beacons.startMonitoringForRegion(
			{}, // Empty region matches all beacons.
			onMonitor,
			onError);
	};

	app.stopMonitoringRegions = function()
	{
		estimote.beacons.stopMonitoringForRegion({});
		app.showHomeScreen();
	};

	app.startRangingNearables = function()
	{
		function onRange(nearables)
		{
			displayNearablesInfo(nearables);
		}

		function onError(errorMessage)
		{
			console.log('Range error: ' + errorMessage);
		}

		function displayNearablesInfo(nearables)
		{
			// Clear HTML list.
			$('#id-screen-range-nearables .style-beacon-list').empty();

			// Generate HTML for nearables.
			$.each(nearables, function(i, nearable)
			{
				var element = $(createNearableHTML(nearable));
				$('#id-screen-range-nearables .style-beacon-list').append(element);
			});
		};

		function createNearableHTML(nearable)
		{
			var colorClasses = 'style-color-blueberry-dark style-color-blueberry-dark-text';
			htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Type</td><td>' + nearable.nameForType
				+ '</td></tr><tr><td>Identifier</td><td>' + nearable.identifier
				+ '</td></tr><tr><td>Zone</td><td>' + nearable.zone
				+ '</td></tr><tr><td>RSSI</td><td>' + nearable.rssi
				+ '</td></tr><tr><td>Temperature</td><td>' + nearable.temperature
				+ '</td></tr><tr><td>Is moving</td><td>' + (nearable.isMoving ? 'Yes' : 'No')
				+ '</td></tr><tr><td>xAcceleration</td><td>' + nearable.xAcceleration
				+ '</td></tr><tr><td>yAcceleration</td><td>' + nearable.yAcceleration
				+ '</td></tr><tr><td>zAcceleration</td><td>' + nearable.zAcceleration
				;
			htm += '</td></tr></table></div>';
			return htm;
		};

		app.showRangeNearablesScreen();

		estimote.nearables.startRangingForType(
			estimote.nearables.ESTNearableTypeAll,
			onRange,
			onError);
	};

	app.stopRangingNearables = function()
	{
		estimote.nearables.stopRanging();
		app.showHomeScreen();
	};

	// ------------- Public touch event functions ------------- //

	app.onStartScanningBeacons = function()
	{
		app.startScanningBeacons();
	};

	app.onStopScanningBeacons = function()
	{
		app.stopScanningBeacons();
	};

	app.onStartRangingBeacons = function()
	{
		app.startRangingBeacons();
	};

	app.onStopRangingBeacons = function()
	{
		app.stopRangingBeacons();
	};

	app.onStartMonitoringRegions = function()
	{
		app.startMonitoringRegions();
	};

	app.onStopMonitoringRegions = function()
	{
		app.stopMonitoringRegions();
	};

	app.onStartRangingNearables = function()
	{
		app.startRangingNearables();
	};

	app.onStopRangingNearables = function()
	{
		app.stopRangingNearables();
	};

	app.onNavigateBack = function()
	{
		history.back();
	};

	// ------------- Initialisation ------------- //

	document.addEventListener('deviceready', onDeviceReady, false);

	app.showHomeScreen();

	// ------------- Return application object ------------- //

	return app;

})();
