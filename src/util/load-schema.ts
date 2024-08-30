import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function loadSchema(name: string): Record<string, unknown> {
    return JSON.parse(
        readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), `../../schemas/${name}.schema.json`), 'utf-8'),
    ) as Record<string, unknown>;
}

export { loadSchema };
