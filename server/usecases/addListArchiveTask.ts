type args = {
  path: string;
};

export type Result = {
  id: string;
};

export type AddListArchiveTaskUC = (args: args) => Promise<Result>;
