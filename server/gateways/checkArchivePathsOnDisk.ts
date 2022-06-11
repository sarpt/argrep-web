import { CheckArchivePathsUC } from "../usecases/checkArchivePaths.ts";

export const checkArchviePathsOnDisk = (): CheckArchivePathsUC =>
  function ({
    paths,
  }) { 
    const pathChecks = new Map<string, boolean>();

    for (const path of paths) {
      try {
        const info = Deno.statSync(path)
        info.isFile ? pathChecks.set(path, true) : pathChecks.set(path, false);
      } catch (_err) {
        pathChecks.set(path, false);
      }
    }

    return { pathChecks };
  }