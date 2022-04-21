import { basename, dirname, join } from "https://deno.land/std@0.125.0/path/mod.ts";
import { LibArchive } from "https://raw.githubusercontent.com/sarpt/deno-libarchive/master/mod.ts";

import { GrepArchivesUC, Hit } from "../../usecases/grepArchive.ts";
import { grepFile } from "../grep.ts";
import { LibMagic } from "../libs/libmagic.ts";

export type dependencies = {
  libArchive: LibArchive,
  libMagic: LibMagic,
  tempPath: string,
};

export const grepArchivesOnDisk = ({
  libArchive,
  libMagic,
  tempPath,
}: dependencies): GrepArchivesUC => async ({
  paths,
  grepPatterns,
}) => {
  const sourcePathsToTempPaths = new Map<string, string>();
  const hits: Hit[] = [];
  const keepUnpackedFiles = false;

  for (const path of paths) {
    const outPath = join(tempPath, basename(path));
    for await (
      const entry of libArchive.walk(path, outPath, keepUnpackedFiles)
    ) {
      if (entry.errMsg) {
        console.error(
          `[ERR] error while walking through the "${path}" file: ${entry.errMsg}`,
        );
        continue;
      }
      if (
        entry.isDirectory || entry.isArchive
      ) {
        continue;
      }

      sourcePathsToTempPaths.set(
        entry.extractedPath,
        entry.extractedPath.replace(tempPath, dirname(path)),
      );
      const results = await grepFile(
        entry.extractedPath,
        {
          options: [],
          regexPatterns: grepPatterns,
          isMimeType: (mime: string, filePath: string): boolean => {
            const { errMsg, result } = libMagic.file(filePath);
            if (errMsg) {
              return false;
            }

            return result === mime;
          },
        },
      );

      hits.push(...results);
    }
  }

  return { hits };
};