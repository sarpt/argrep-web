type args = {
  paths: string[];
};

export type result = {
  pathChecks: Map<string, boolean>;
};

export type CheckArchivePathsUC = (args: args) => result;
