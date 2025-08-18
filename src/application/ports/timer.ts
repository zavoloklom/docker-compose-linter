interface Timer {
  get(label: string): number; // Get timer result
  start(label: string): void; // Start timer
  stop(label: string): number; // Stop timer and store result
  read(label: string): number; // Get current value of timer
}

export { Timer };
