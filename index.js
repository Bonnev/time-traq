const activeWindow = require('active-win');
const moment = require('moment');

const fs = require('fs');

let activeWindows = [];

let tempCounter = 0;
const getActiveWindow = async () => {
	const window = await activeWindow({});

	// normalize
	const path = window?.owner?.path?.replace(/\t/g, '_').replace(/\r\n/g, '_').replace(/\n/g, '_');
	const title = window?.title?.replace(/\t/g, '_').replace(/\r\n/g, '_').replace(/\n/g, '_');

	const fullTitle = path + '\t' + title;

	const lastWindow = activeWindows[activeWindows.length - 1];
	const isNewDay = lastWindow && !getCurrentTime().isSame(lastWindow.endTime, 'day');

	if (!lastWindow) {
		activeWindows.push({
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		});
	} else if (lastWindow.fullTitle !== fullTitle) {
		const line = lastWindow.fullTitle + '\t' + lastWindow.startTime.format('HH:mm:ss') + '\t' + lastWindow.endTime.format('HH:mm:ss') + /*'\t' + JSON.stringify(window) +*/ '\n';
		const lineToPrint = path + '__\\t__' + title + '__\\t__' + lastWindow.startTime.format('HH:mm:ss') + '__\\t__' + lastWindow.endTime.format('HH:mm:ss') + /*'\t' + JSON.stringify(window) +*/ '\n';

		if (!isNewDay && lastWindow) {
			console.log(`Switched window. Writing to file: ${lineToPrint}`);
			fs.promises.appendFile('./test.txt', line);
		}

		activeWindows.push({
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		});
	} else if (!isNewDay) {
		console.log('Still on: ' + fullTitle);
		lastWindow.endTime = getCurrentTime();
	}
	tempCounter++;

	if (isNewDay) {
		const dateStr = lastWindow.endTime.format('YYYY.MM.DD');
		const newName = `./test-${dateStr}.txt`;
		console.log(`Good morning! Renaming ./test.txt to ${newName}`);

		fs.stat(newName, function(err, stat) {
			if (err == null) {
				// file exists
				const newNameRandom = newName + +(Math.random() * 1000);
				console.log(`File exists! Renaming to ${newNameRandom}`);
				fs.rename('./test.txt', newNameRandom, (err) => {
					err && console.log('Error renaming text.txt', err);
				});
			} else if (err.code === 'ENOENT') {
				// file does not exist
				fs.rename('./test.txt', newName, (err) => {
					err && console.log('Error renaming text.txt', err);
				});
			} else {
				console.error('Error when checking if file exists: ', err);
			}
		});

		activeWindows = [activeWindows[activeWindows.lenth-1]];
	}
}
function getCurrentTime() {
	return moment();
}

setInterval(() => {
	getActiveWindow()
}, 10000);