const fs = require('fs');
const path = require('path');

(async () => {
    if (process.argv.length === 2) {
        console.error('Expected input directory path');
        process.exit(1);
    }
    const inputDir = process.argv[2]
    const datePattern = /^(\d{4}\-\d{2})\-\d{2}/;
    const groupKey = 1;
    const files = fs.readdirSync(inputDir);
    const monthFilenamePairs = files.filter(fileOrDirName => fs.statSync(inputDir + path.sep + fileOrDirName).isFile() && datePattern.test(fileOrDirName))
        .map(filename => [datePattern.exec(filename)[groupKey], filename]);
    const filesByMonths = new Map();
    monthFilenamePairs.forEach(([month, filename]) => {
        if (filesByMonths.has(month)) {
            filesByMonths.set(month, [...filesByMonths.get(month), filename]);
        } else {
            filesByMonths.set(month, [filename]);
        }
    });
    const months = Array.from(filesByMonths.keys());
    months.forEach(month => {
        const monthPath = inputDir + path.sep + month;
        if (!fs.existsSync(monthPath)) {
            fs.mkdirSync(monthPath);
        }
    });
    const groupedFiles = Array.from(filesByMonths.entries());
    groupedFiles.forEach(([month, filenames]) => {
        filenames.forEach(filename => {
            const from = inputDir + path.sep + filename;
            const to = inputDir + path.sep + month + path.sep + filename;
            fs.renameSync(from, to);
        });
    });
})();
