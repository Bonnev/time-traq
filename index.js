const activeWindow = require('active-win');
const moment = require('moment');

const fs = require('fs');

const activeWindows = [];

let tempCounter = 0;
const getActiveWindow = async () => {
	const window = await activeWindow({});
	const fullTitle = window.owner.path + '\t' + window.title;
	
	const lastWindow = activeWindows[activeWindows.length - 1];
	const isNewDay = lastWindow && getCurrentTime().diff(lastWindow.endTime, 'days') > 0;
	console.log('isnewday',isNewDay)
	console.log(getCurrentTime())
	tempCounter++;

	if (!lastWindow || lastWindow.fullTitle !== fullTitle) {
		lastWindow && fs.promises.appendFile('./test.txt', lastWindow.fullTitle + '\t' + lastWindow.startTime.format('HH:mm:SS') + '\t' + lastWindow.endTime.format('HH:mm:SS') + '\n');
		activeWindows.push({
			fullTitle: fullTitle,
			startTime: getCurrentTime(),
			endTime: getCurrentTime()
		});
	} else if (!isNewDay) {
		lastWindow.endTime = getCurrentTime();
	}

	if (isNewDay) {
		const dateStr = lastWindow.endTime.format('YYYY.MM.DD');
		fs.promises.rename('./test.txt', `./test-${dateStr}.txt`);
		activeWindows = [lastWindow];
	}
}
function getCurrentTime() {
	console.log(tempCounter)
	if (tempCounter >= 5) {
		console.log('marti',moment().add(1, 'days'))
		return moment().add(1, 'days');
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
}, 5000);