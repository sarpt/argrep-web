export type Input = {
  pattern: string,
};

export type Output = {
  taskId: string;
};

export type startGrepUC = (input: Input) => Promise<Output>;
