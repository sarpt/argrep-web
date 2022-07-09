import { Entry } from "./listArchive.ts";

type args = {
  id: string;
};

export type Results = AsyncGenerator<
  { entries: Entry[]; errMsg?: string },
  { entries: Entry[] },
  void
>;

export type GetListArchiveTaskResultsUC = (
  args: args,
) => Promise<Results | undefined>;
