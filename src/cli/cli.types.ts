interface CLIConfig {
    files: string[];
    recursive: boolean;
    fix: boolean;
    fixDryRun: boolean;
    formatter: string;
    config?: string;
    quiet: boolean;
    outputFile?: string;
    color: boolean;
    debug: boolean;
    exclude: string[];
}

export { CLIConfig };
