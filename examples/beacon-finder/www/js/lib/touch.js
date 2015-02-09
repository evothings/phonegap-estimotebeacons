// File: touch.js
(function() {

window.evothings = window.evothings || {}
window.evothings.touch = {}

evothings.touch.distanceThreshold = 10

evothings.touch.isTouchDevice = function() {
	return !!('ontouchstart' in window // works on most browsers
		|| 'onmsgesturechange' in window) // works on ie10
}

/**
 * Install a tap handler on the given element.
 * callback(pageX, pageY)
 */
evothings.touch.onTap = function(domElement, callback) {

	var touchEventIsActive = false
	var lastX
	var lastY

	var touchStart = function(event) {
		touchEventIsActive = true
		lastX = event.targetTouches[0].pageX
		lastY = event.targetTouches[0].pageY
	}

	var touchMove = function(event) {
		if (checkCancelTouchEvent(event)) { return }
		lastX = event.targetTouches[0].pageX
		lastY = event.targetTouches[0].pageY
	}

	var touchEnd = function() {
		if (!touchEventIsActive) { return }

		touchEventIsActive = false

		// Prevent default actions.
		event.preventDefault()

		// Trigger event.
		callback(lastX, lastY)
	}

	var touchCancel = function() {
		touchEventIsActive = false
	}

	var checkCancelTouchEvent = function(event) {
		if (!touchEventIsActive) { return }
		var x = event.targetTouches[0].pageX
		var y = event.targetTouches[0].pageY
		var dx = Math.abs(x - lastX)
		var dy = Math.abs(y - lastY)
		if (dx > evothings.touch.distanceThreshold ||
			dy > evothings.touch.distanceThreshold) {
			// Cancel event.
			touchEventIsActive = false
		}
		return touchEventIsActive
	}

	// Add event listeners to DOM element.
	if (evothings.touch.isTouchDevice()) {
		domElement.addEventListener('touchstart', touchStart, false)
		domElement.addEventListener('touchmove', touchMove, false)
		domElement.addEventListener('touchend', touchEnd, false)
		domElement.addEventListener('touchcancel', touchCancel, false)
	}
} // End of evothings.touch.onTap

})() // Calling closure
