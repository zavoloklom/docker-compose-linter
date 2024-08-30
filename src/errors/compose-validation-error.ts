import type { ErrorObject } from 'ajv';

class ComposeValidationError extends Error {
    keyword: string;

    instancePath: string;

    schemaPath: string;

    details: ErrorObject;

    constructor(e: ErrorObject) {
        super(`Validation error: ${e?.message}`);
        this.name = 'ComposeValidationError';
        this.keyword = e.keyword;
        this.instancePath = e.instancePath;
        this.schemaPath = e.schemaPath;
        this.details = e;
    }

    toString(): string {
        return `ComposeValidationError: instancePath="${this.instancePath}", schemaPath="${this.schemaPath}", message="${this.message}".`;
    }
}

export { ComposeValidationError };
