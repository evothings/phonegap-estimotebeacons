// Range nearables screen.
;(function(app)
{
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
			$('#id-screen-range-nearables .style-item-list').empty();

			// Generate HTML for nearables.
			$.each(nearables, function(i, nearable)
			{
				var element = $(createNearableHTML(nearable));
				$('#id-screen-range-nearables .style-item-list').append(element);
			});
		};

		function createNearableHTML(nearable)
		{
			var colorClasses = 'style-color-blueberry-dark style-color-blueberry-dark-text';
			var htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Type</td><td>' + nearable.nameForType
				+ '</td></tr><tr><td>Identifier</td><td>' + nearable.identifier
				+ '</td><tr><td>Color</td><td>' + nearable.nameForColor
				+ '</td></tr><tr><td>Zone</td><td>' + nearable.zone
				+ '</td></tr><tr><td>RSSI</td><td>' + nearable.rssi
				+ '</td></tr><tr><td>Temperature</td><td>' + nearable.temperature
				+ '</td></tr><tr><td>Is moving</td><td>' + (nearable.isMoving ? 'Yes' : 'No')
				+ '</td></tr><tr><td>xAcceleration</td><td>' + nearable.xAcceleration
				+ '</td></tr><tr><td>yAcceleration</td><td>' + nearable.yAcceleration
				+ '</td></tr><tr><td>zAcceleration</td><td>' + nearable.zAcceleration
				+ '</td></tr></table></div>';
			return htm;
		};

		// Show screen.
		app.showScreen('id-screen-range-nearables');
		$('#id-screen-range-nearables .style-item-list').empty();

		// Start ranging.
		estimote.nearables.startRangingForType(
			estimote.nearables.NearableTypeAll,
			onRange,
			onError);
	};

	app.stopRangingNearables = function()
	{
		estimote.nearables.stopRanging();
		app.showHomeScreen();
	};

})(app);
