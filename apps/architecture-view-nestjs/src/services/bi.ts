import TelemetryReporter from '@vscode/extension-telemetry';
import { telemetryInstrumentationKey } from '../consts';
import { addNewMeasurement, calculateMeasurement } from './measurements';

export type BIEvent = {
  action: BI_ACTIONS;
  payload?: unknown;
  measurementToken?: symbol;
};

export enum BI_ACTIONS {
  start = 'showArchitectureCommand',
  parserStart = 'runScout',
  parserSuccess = 'runScoutSuccess',
  parserError = 'runScoutError',
  clientStart = 'clientStart',
  openFile = 'openFile',
}

let reporter: TelemetryReporter;

const log = (event: BIEvent) => {
  console.log(`BI: ${event.action}`);
  if (event.payload) {
    console.log(JSON.stringify(event.payload));
  }
  const measurements = getMeasurements(event);
  if (measurements) {
    console.log(`${event.action} took ${measurements.duration} seconds`);
  }
};

const getMeasurements = (event: BIEvent): { [key: string]: number } | undefined => {
  if (!event.measurementToken) {
    return;
  }
  const duration = calculateMeasurement(event.measurementToken);
  if (!duration) {
    return;
  }
  return {
    duration,
  };
};

export const initReporter = () => {
  reporter = new TelemetryReporter(telemetryInstrumentationKey);
  return reporter;
};

export const sendEvent = (event: BIEvent): symbol | undefined => {
  log(event);
  if (reporter) {
    reporter.sendTelemetryEvent(event.action, undefined, getMeasurements(event));
  }
  if (!event.measurementToken) {
    return addNewMeasurement();
  }
};

export const sendException = (error: Error) => {
  console.error(error);
  if (reporter) {
    reporter.sendTelemetryException(error);
  }
};
