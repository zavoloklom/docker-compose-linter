import { performance } from 'node:perf_hooks';

import type { Timer } from '../../application/ports/timer';

class PerformanceTimer implements Timer {
  private timers: Map<string, number>;
  private results: Map<string, number>;

  constructor() {
    this.timers = new Map<string, number>();
    this.results = new Map<string, number>();
  }

  get(label: string): number {
    if (!this.results.has(label)) {
      return 0;
    }
    return this.results.get(label) as number;
  }

  start(label: string): void {
    this.timers.set(label, performance.now());
  }

  read(label: string): number {
    if (!this.timers.has(label)) {
      return 0;
    }
    const startedTime = this.timers.get(label) as number;
    return performance.now() - startedTime;
  }

  stop(label: string): number {
    if (!this.timers.has(label)) {
      return 0;
    }
    const startedTime = this.timers.get(label) as number;
    const duration = performance.now() - startedTime;

    this.results.set(label, duration);
    this.timers.delete(label);

    return duration;
  }
}

const makePerformanceTimer = (isEnabled: boolean): Timer => {
  if (!isEnabled) {
    return {
      start: () => {},
      stop: () => 0,
      read: () => 0,
      get: () => 0,
    };
  }
  return new PerformanceTimer();
};

export { PerformanceTimer, makePerformanceTimer };
