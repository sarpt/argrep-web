type args = {
  paths: string[];
  grepPatterns: string[];
};

export type Result = {
  id: string;
};

export type AddGrepTaskUC = (args: args) => Promise<Result>;
