import { Hit } from "../entities/hit";

export type Input = {
  taskId: string;
};

export type Output = {
  hits: Hit[],
  done: boolean,
  errMsg?: string,
};

export type getGrepResultsUC = (input: Input) => Promise<Output>;
