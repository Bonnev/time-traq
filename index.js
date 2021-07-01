const monitor = require('active-window');

const fs = require('fs');

const activeWindows = [];

callback = function(window){
	const fullTitle = window.app + ' | ' + window.title;
	
	const lastWindow = activeWindows[activeWindows.length - 1];

	if (!lastWindow || lastWindow.fullTitle !== fullTitle) {
		lastWindow && fs.promises.appendFile('./test.txt', lastWindow.fullTitle + '\t' + lastWindow.startTime + '\t' + lastWindow.endTime + '\n');
		activeWindows.push({
			fullTitle: fullTitle,
			startTime: getCurrentTime()
		});
	} else {
		lastWindow.endTime = getCurrentTime();
	}
}

function getCurrentTime() {
	const date = new Date();
	const hour = ("0" + date.getHours()).slice(-2);
	const minute = ("0" + date.getMinutes()).slice(-2);
	const second = ("0" + date.getSeconds()).slice(-2);
	return hour + ":" + minute + ":" + second;
}

/**
 * Watch the active window 
 * @callback
 * @number of requests; infinity = -1 
 * @interval between requests
 */
monitor.getActiveWindow(callback,-1,5);