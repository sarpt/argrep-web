import { Handler } from "https://deno.land/std@0.135.0/http/mod.ts";
import { router } from "https://crux.land/api/get/2KNRVU.ts";
import { putGreps } from "./handlers/greps.ts";

import { GrepArchivesUC } from "../usecases/grepArchive.ts";

export type dependencies = {
  grepArchives: GrepArchivesUC;
};

export const routing: (deps: dependencies) => Handler = (deps) =>
  (req) => {
    const handler = router({
      "PUT@/greps": putGreps(deps.grepArchives),
    });

    return handler(req);
  };
