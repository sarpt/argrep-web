type args = {
  paths: string[];
  grepPatterns: string[];
};

export type Hit = {
  errMsg?: string,
  path: string;
  line: number;
  match: string;
};


export type GrepArchivesUC = (args: args) => AsyncGenerator<Hit, void, void>;
