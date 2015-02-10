// Monitor nearables screen.
;(function(app)
{
	app.startMonitoringNearables = function()
	{
		function onMonitor(state)
		{
			displayRegionInfo(state);
		}

		function onError(errorMessage)
		{
			console.log('Monitor error: ' + errorMessage);
		}

		function displayRegionInfo(state)
		{
			// Clear HTML.
			$('#id-screen-monitor-nearables .style-item-list').empty();

			var colorClasses = 'style-color-blueberry-dark style-color-blueberry-dark-text';
			var htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Type</td><td>' + state.type
				+ '</td></tr><tr><td>State</td><td>' + state.state
				+ '</td></tr></table></div>';
			$('#id-screen-monitor-nearables .style-item-list').append(htm);
		};

		// Show screen.
		app.showScreen('id-screen-monitor-nearables');
		$('#id-screen-monitor-nearables .style-item-list').empty();

		// Start monitoring.
		estimote.nearables.startMonitoringForType(
			//estimote.nearables.NearableTypeDog,
			//estimote.nearables.NearableTypeUnknown,
			estimote.nearables.NearableTypeAll,
			onMonitor,
			onError);
	};

	app.stopMonitoringNearables = function()
	{
		estimote.nearables.stopMonitoring();
		app.showHomeScreen();
	};

})(app);
