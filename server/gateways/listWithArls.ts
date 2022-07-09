import { readLines } from "https://deno.land/std@0.136.0/io/buffer.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.136.0/streams/mod.ts";
import { CheckArchivePathsUC } from "../usecases/checkArchivePaths.ts";

import { Entry, ListArchiveUC } from "../usecases/listArchive.ts";

type Data = Entry & {
  err?: string;
  warn?: string;
  info?: string;
};

const socketPath = "/tmp/arls.sock";

const argrepCmd = "arls";
const unixSocketPathArg = "--unix-socket-path";
const jsonOutputArg = "--json";

type dependencies = {
  checkArchivePaths: CheckArchivePathsUC;
};

export const listArchive = (
  { checkArchivePaths }: dependencies,
): ListArchiveUC =>
  async function* ({
    path,
  }) {
    const { pathChecks } = checkArchivePaths({ paths: [path] });
    const failedPaths = [...pathChecks].filter(([, check]) => !check);
    if (failedPaths.length) {
      yield {
        path: "",
        errMsg: `could not find provided paths: ${
          failedPaths.map(([path]) => path).join(", ")
        }`,
      };
      return;
    }

    const unixSocketPath = [unixSocketPathArg, socketPath];
    Deno.spawn(argrepCmd, {
      args: [
        ...unixSocketPath,
        jsonOutputArg,
        ...path,
      ],
    });

    const listener = Deno.listen({ path: socketPath, transport: "unix" });
    const conn = await listener.accept();
    const reader = readerFromStreamReader(conn.readable.getReader());

    for await (const line of readLines(reader)) {
      const argrepData: Data = JSON.parse(line);
      if (isDataResult(argrepData)) {
        yield argrepData;
      }
    }
  };

function isDataResult(data: Data): data is Entry {
  return !!(data.path && data.variant);
}
