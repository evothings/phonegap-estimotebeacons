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

		function dogIsMovingRuleFunction(event)
		{
			if (event.nearable.isMoving)
			{
				// Dog is moving.
    			estimote.triggers.updateRuleState(event, true);
    		}
    		else
			{
				// Dog is still.
    			estimote.triggers.updateRuleState(event, false);
    		}
		}

		function displayTriggerState(trigger)
		{
			// Clear HTML.
			$('#id-screen-trigger-nearables .style-item-list').empty();

			var colorClasses = 'style-color-blueberry-dark style-color-blueberry-dark-text';
			var htm = '<div class="' + colorClasses + '" style="font-size:140%">'
				+ (trigger.state ? 'Dog is moving' : 'Dog is still')
				+ '</div>';
			$('#id-screen-trigger-nearables .style-item-list').append(htm);

			htm = '<div class="' + colorClasses + '">'
				+ '<table><tr><td>Trigger Identifier:</td><td>' + trigger.identifier
				+ '</td></tr><tr><td>Trigger State:</td><td>' + trigger.state
				+ '</td></tr></table></div>';
			$('#id-screen-trigger-nearables .style-item-list').append(htm);
		};

		// Show screen.
		app.showScreen('id-screen-trigger-nearables');
		$('#id-screen-trigger-nearables .style-item-list').empty();

		// Create a trigger rule.
		var dogIsMovingRule = estimote.triggers.createRuleForType(
			estimote.nearables.NearableTypeDog,
			dogIsMovingRuleFunction);

		// Create trigger object.
		trigger = estimote.triggers.createTrigger('DogTrigger', [dogIsMovingRule]);

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
