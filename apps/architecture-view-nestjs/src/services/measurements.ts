const measurements = new Map<symbol, number>();

export const addNewMeasurement = (): symbol => {
  const token = Symbol();
  measurements.set(token, Date.now());
  return token;
};

export const calculateMeasurement = (token: symbol): number | undefined => {
  const start = measurements.get(token);
  if (!start) {
    return;
  }
  return (Date.now() - start) / 1000; // return in seconds
};

export const clearAllMeasurement = () => {
  measurements.clear();
};
