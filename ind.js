const monitor = require('node-active-window');
 
monitor.getActiveWindow((err, window) => {
	if (!err) {
		console.log(window); // { app: 'Code', title: 'test.js - node-active-window - Visual Studio Code' }
	}
});