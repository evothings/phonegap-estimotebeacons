// Monitor nearable trigger screen.
;(function(app)
{
	// Trigger object.
	var trigger = null;

	app.startMonitoringNearableTrigger = function()
	{
		function onTriggerChangedState(trigger)
		{
			displayTriggerState(trigger);
		}

		function onTriggerError(errorMessage)
		{
			console.log('Trigger error: ' + errorMessage);
		}

		function dogIsCloseRuleFunction(event)
		{
			//console.log('Dog zone: ' + event.nearable.zone + ' ' + event.nearable.rssi);
			if (event.nearable.zone == estimote.nearables.ESTNearableZoneImmediate ||
				event.nearable.zone == estimote.nearables.ESTNearableZoneNear)
			{
				// Dog is close.
    			estimote.triggers.updateRuleState(event, true)
    		}
    		else
			{
				// Dog is not close.
    			estimote.triggers.updateRuleState(event, false)
    		}
		}

		function displayTriggerState(trigger)
		{
			// Clear HTML.
			$('#id-screen-trigger-nearables .style-beacon-list').empty();

			var colorClasses = 'style-color-blueberry-dark style-color-blueberry-dark-text';
			var htm = '<div class="' + colorClasses + '" style="font-size:140%">'
				+ (trigger.state ? 'Dog is close' : 'Dog is not close')
				+ '</div>';
			$('#id-screen-trigger-nearables .style-beacon-list').append(htm);

			htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Trigger Identifier:</td><td>' + trigger.identifier
				+ '</td></tr><tr><td>Trigger State</td><td>' + trigger.state
				+ '</td></tr></table></div>';
			$('#id-screen-trigger-nearables .style-beacon-list').append(htm);
		};

		// Show screen.
		app.showScreen('id-screen-trigger-nearables');
		$('#id-screen-trigger-nearables .style-beacon-list').empty();

		// Create a trigger rule.
		var dogIsCloseRule = estimote.triggers.createRuleForType(
			estimote.nearables.ESTNearableTypeDog,
			dogIsCloseRuleFunction);

		// Create trigger object.
		trigger = estimote.triggers.createTrigger('DogTrigger', [dogIsCloseRule]);

		// Start monitoring for trigger.
		estimote.triggers.startMonitoringForTrigger(
			trigger,
			onTriggerChangedState,
			onTriggerError);
	};

	app.stopMonitoringNearableTrigger = function()
	{
		estimote.triggers.stopMonitoringForTrigger(trigger);
		app.showHomeScreen();
	};

})(app);
