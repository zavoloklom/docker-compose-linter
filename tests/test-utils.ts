const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/g, ' ').trim();

export { normalizeYAML };
