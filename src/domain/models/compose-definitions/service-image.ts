interface ServiceImageDefinition {
  registry: string | null; // Registry, e.g. "docker.io", "gcr.io", "my-registry:5000"
  path: string[]; // Path to image in registry, zero or more namespace/project segments between registry and image
  image: string; // Image, the repository (final segment)
  tag: string | null; // Tag, e.g. "latest", "5", "1.2.3-alpine"
  digest: string | null; // Hash, e.g. "sha256:deadbeef..."
}

export { ServiceImageDefinition };
