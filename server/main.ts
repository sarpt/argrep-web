import { serve } from "https://deno.land/std@0.135.0/http/mod.ts";
import { checkArchviePathsOnDisk } from "./gateways/checkArchivePathsOnDisk.ts";
import { grepArchives } from "./gateways/grepsWithArgrep.ts";
import { addGrepTask, getGrepTaskResults } from "./gateways/tasksInMemory.ts";

import { routing } from "./routing.ts";

const PORT = 8080;
console.log(`Server is running on http://localhost:${PORT}`);

const checkArchivePaths = checkArchviePathsOnDisk();

const dependencies = {
  addGrepTask: addGrepTask(grepArchives({ checkArchivePaths })),
  getGrepTaskResult: getGrepTaskResults(),
};

await serve(routing(dependencies), {
  port: PORT,
});
