const activeWindow = require('active-win');
const moment = require('moment');

const fs = require('fs');

let lastWindow = null;

const getActiveWindow = async () => {
	const window = await activeWindow({});

	// normalize
	const path = window?.owner?.path?.replace(/\t/g, '_').replace(/\r\n/g, '_').replace(/\n/g, '_');
	const title = window?.title?.replace(/\t/g, '_').replace(/\r\n/g, '_').replace(/\n/g, '_');

	const fullTitle = path + '\t' + title;

	if (!lastWindow) {
		lastWindow = {
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		};
	} else if (lastWindow.fullTitle !== fullTitle) {
		const line = lastWindow.fullTitle + '\t' + lastWindow.startTime.format('HH:mm:ss') + '\t' + lastWindow.endTime.format('HH:mm:ss') + /*'\t' + JSON.stringify(window) +*/ '\n';
		const lineToPrint = path + '__\\t__' + title + '__\\t__' + lastWindow.startTime.format('HH:mm:ss') + '__\\t__' + lastWindow.endTime.format('HH:mm:ss') + /*'\t' + JSON.stringify(window) +*/ '\n';

		console.log(`Switched window. Writing to file: ${lineToPrint}`);
		const dateStr = getCurrentTime().format('YYYY.MM.DD');
		fs.promises.appendFile(`./test-${dateStr}.txt`, line);

		lastWindow = {
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		};
	} else {
		console.log('Still on: ' + fullTitle);
		lastWindow.endTime = getCurrentTime();
	}
}

function getCurrentTime() {
	return moment();
}

setInterval(() => {
	getActiveWindow()
}, 10000);