import { createWriteStream } from 'node:fs';
import { get } from 'node:https';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = 'https://raw.githubusercontent.com/compose-spec/compose-spec/main/schema/compose-spec.json';
const outputPath = join(dirname(fileURLToPath(import.meta.url)), '../schemas/compose.schema.json');

get(url, (response) => {
  const fileStream = createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('File downloaded successfully');
  });
}).on('error', (error) => {
  console.error('Error downloading the file:', error.message);
});
