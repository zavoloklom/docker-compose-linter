const fs = require('fs');
const path = require('path');
const https = require('https');

const url = 'https://raw.githubusercontent.com/compose-spec/compose-spec/main/schema/compose-spec.json';
const outputPath = path.join(__dirname, '../schemas/compose.schema.json');

https.get(url, (response) => {
    const fileStream = fs.createWriteStream(outputPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
        fileStream.close();
        console.log('File downloaded successfully');
    });
}).on('error', (err) => {
    console.error('Error downloading the file:', err);
});
