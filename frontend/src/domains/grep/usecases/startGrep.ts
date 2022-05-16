export type Input = {
  pattern: string,
  path: string,
};

export type Output = {
  taskId: string;
};

export type startGrepUC = (input: Input) => Promise<Output>;
