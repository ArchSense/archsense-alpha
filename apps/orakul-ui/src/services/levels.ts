export enum Levels {
  // Services = 'Services',
  Modules = 'Modules',
  Components = 'Classes',
}

export const getNextLevel = (curr: Levels) => {
  const stateMachine = {
    // [Levels.Services]: Levels.Modules,
    [Levels.Modules]: Levels.Components,
    [Levels.Components]: null,
  };
  return stateMachine[curr];
};
