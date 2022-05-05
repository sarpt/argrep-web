import { Hit } from "./grepArchive.ts";

type args = {
  id: string;
};

export type Results = AsyncGenerator<{ hits: Hit[] }, { hits: Hit[] }, void>;

export type GetGrepTaskResultsUC = (args: args) => Promise<Results | undefined>;
