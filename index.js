const activeWindow = require('active-win');
const moment = require('moment');

const fs = require('fs');

let activeWindows = [];

let tempCounter = 0;
const getActiveWindow = async () => {
	const window = await activeWindow({});
	const fullTitle = window?.owner?.path + '\t' + window.title;

	const lastWindow = activeWindows[activeWindows.length - 1];
	const isNewDay = lastWindow && getCurrentTime().diff(lastWindow.endTime, 'days') > 0;

	if (!lastWindow) {
		activeWindows.push({
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		});
	} else if (lastWindow.fullTitle !== fullTitle) {
		const line = lastWindow.fullTitle + '\t' + lastWindow.startTime.format('HH:mm:SS') + '\t' + lastWindow.endTime.format('HH:mm:SS') + '\n';

		console.log('Switched window. Writing to file: ' + line);
		lastWindow && fs.promises.appendFile('./test.txt', line);

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
		fs.rename('./test.txt', `./test-${dateStr}.txt`, (err) => {
			console.log(!!err);
			console.log('erere', err);
		});
		activeWindows = [activeWindows[activeWindows.lenth-1]];
	}
}
function getCurrentTime() {
	//console.log(tempCounter)
	if (tempCounter >= 5) {
		//console.log('marti',moment().add(tempCounter, 'days'))
		return moment().add(tempCounter/5, 'days');
	}

	return moment();
	// const date = new Date();
	// const hour = ("0" + date.getHours()).slice(-2);
	// const minute = ("0" + date.getMinutes()).slice(-2);
	// const second = ("0" + date.getSeconds()).slice(-2);
	// return hour + ":" + minute + ":" + second;
}

setInterval(() => {
	getActiveWindow()
}, 2000);