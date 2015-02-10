// Monitor regions screen.
;(function(app)
{
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
			$('#id-screen-monitor-regions .style-item-list').empty();

			var element = $(createRegionStateHTML(regionState));
			$('#id-screen-monitor-regions .style-item-list').append(element);
		};

		function createRegionStateHTML(regionState)
		{
			var color = 'style-color-pink';
			var htm = '<div class="' + color + '">'
				+ '<table><tr><td>State</td><td>' + regionState.state
				+ '</td></tr><tr><td>Major</td><td>' + regionState.major
				+ '</td></tr><tr><td>Minor</td><td>' + regionState.minor
				+ '</td></tr><tr><td>Identifier</td><td>' + regionState.identifier
				+ '</td></tr><tr><td>UUID</td><td>' + regionState.uuid
				+ '</td></tr></table></div>';
			return htm;
		};

		// Show screen.
		app.showScreen('id-screen-monitor-regions');
		$('#id-screen-monitor-regions .style-item-list').empty();

		// Request authorisation.
		estimote.beacons.requestAlwaysAuthorization();

		// Start monitoring.
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

})(app);
