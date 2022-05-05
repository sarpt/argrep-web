type args = {
  paths: string[];
  grepPatterns: string[];
};

export type Hit = {
  path: string;
  line: number;
  match: string;
};

export type Result = {
  hits: Hit[];
};

export type GrepArchivesUC = (args: args) => AsyncGenerator<Hit, Result, void>;
