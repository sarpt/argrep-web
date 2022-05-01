import { readLines } from "https://deno.land/std@0.136.0/io/buffer.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.136.0/streams/mod.ts";

import { GrepArchivesUC, Hit } from "../../usecases/grepArchive.ts";

type Data = Hit & {
  err?: string;
  warn?: string;
  info?: string;
};

const socketPath = "/tmp/argrep.sock";

const argrepCmd = "argrep";
const unixSocketPathArg = "--unix-socket-path";
const patternArg = "-e"; 
const jsonOutputArg = "--json";
const grepArgsSeparator = "--";
const caseInsensitiveGrepArg = "-i";

export const grepArchivesWithArgrep = (): GrepArchivesUC =>
  async ({
    paths,
    grepPatterns,
  }) => {
    const unixSocketPath = [unixSocketPathArg, socketPath];
    const grepPatternsArgs = grepPatterns.reduce(
      (acc, pattern) => [...acc, patternArg, pattern],
      [] as string[],
    );
    Deno.spawn(argrepCmd, {
      args: [
        ...unixSocketPath,
        jsonOutputArg,
        ...grepPatternsArgs,
        ...paths,
        grepArgsSeparator,
        caseInsensitiveGrepArg,
      ],
    });

    const listener = Deno.listen({ path: socketPath, transport: "unix" });
    const conn = await listener.accept();
    const reader = readerFromStreamReader(conn.readable.getReader());

    const hits: Hit[] = [];
    for await (const line of readLines(reader)) {
      const argrepData: Data = JSON.parse(line);
      if (isDataResult(argrepData)) {
        hits.push(argrepData);
      }
    }

    return { hits };
  };

function isDataResult(data: Data): data is Hit {
  return !!(data.path && data.match && data.line);
}
