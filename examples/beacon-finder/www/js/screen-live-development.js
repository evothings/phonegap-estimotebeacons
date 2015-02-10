// Live development screen.
;(function(app)
{
	function setSavedConnectAddress()
	{
		$('#id-screen-live-development-connect-url').val(
			localStorage.getItem('live-development-connect-url')
			|| '192.168.0.x');

	}

	// Add protocol and port if needed.
	function parseConnectAddress(address)
	{
		var url = address.trim();

		if (!url.match('^https?://[A-Z0-9\.]*.*$'))
		{
			// Add protocol.
			url = 'http://' + url;
		}

		if (url.match('^https?://[0-9\.]*$') &&
			!url.match('^https?://[0-9\.]*:[0-9]*$'))
		{
			// Add port to numeric ip address.
			url = url + ':4042';
		}

		return url;
	}

	app.connectToEvothingsWorkbench = function()
	{
		// Get contents of url text field.
		var address = $('#id-screen-live-development-connect-url').val();

		// Add protocol and port if needed.
		var url = parseConnectAddress(address);

		// Save the URL.
		localStorage.setItem('live-development-connect-url', url);

		// Open URL.
		window.location.assign(url);
	};

	app.showLiveDevelopmentScreen = function()
	{
		// Show screen.
		app.showScreen('id-screen-live-development');

		// Show last used connect address.
		setSavedConnectAddress();
	};

})(app);
