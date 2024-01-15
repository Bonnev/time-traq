const fs = require('fs');
const moment = require('moment');

try {
	// read contents of the file
	const data = fs.readFileSync('test.txt', 'UTF-8');

	// split the contents by new line
	const lines = data.split(/\r?\n/);

	// print all lines
	lines.forEach((line) => {
		if (line === '') return;
		const parts = line.split('\t');
		const process = parts[0];
		const title = parts[1];
		const start = parts[2];
		const end = parts[3];

		const finalStart = transformTime(start);
		const finalEnd = transformTime(end);

		const finalLine = `${process}\t${title}\t${finalStart}\t${finalEnd}\n`;

		fs.appendFileSync('textConverted.txt', finalLine)
	});
} catch (err) {
	console.error(err);
}

function transformTime(time) {
	const parts = time.split(':');
	const fseconds = parseInt(parts[2]);
	const seconds = parseInt(fseconds/100*60);
	const strSeconds = seconds < 10 ? "0" + seconds : seconds;
	return `${parts[0]}:${parts[1]}:${strSeconds}`;
}