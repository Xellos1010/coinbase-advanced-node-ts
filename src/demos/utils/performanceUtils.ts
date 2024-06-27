// src/demos/utils/performanceUtils.ts
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

export interface Timings {
  startTime: number;
  endTime: number;
  stepTimings: { [key: string]: number };
}

export function startPerformanceTimings(): Timings {
  return {
    startTime: performance.now(),
    endTime: 0,
    stepTimings: {},
  };
}

export function recordStepTiming(timings: Timings, stepName: string, startTime: number) {
  timings.stepTimings[stepName] = performance.now() - startTime;
}

export function writePerformanceDataToFile(testName: string, timings: Timings) {
  const dir = path.join(process.cwd(), 'demo-performance-stats');
  const filePath = path.join(dir, `${testName}_performanceMetrics.json`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(filePath, JSON.stringify(timings, null, 2));
}
