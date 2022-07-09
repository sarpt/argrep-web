import { serve } from "https://deno.land/std@0.135.0/http/mod.ts";
import { checkArchviePathsOnDisk } from "./gateways/checkArchivePathsOnDisk.ts";
import { grepArchives } from "./gateways/grepsWithArgrep.ts";
import { listArchive } from "./gateways/listWithArls.ts";
import {
  addGrepTask,
  addListArchiveTask,
  getGrepTaskResults,
  getListArchiveResults,
} from "./gateways/tasksInMemory.ts";

import { routing } from "./routing.ts";

const PORT = 8080;
console.log(`Server is running on http://localhost:${PORT}`);

const checkArchivePaths = checkArchviePathsOnDisk();

const dependencies = {
  addGrepTask: addGrepTask(grepArchives({ checkArchivePaths })),
  getGrepTaskResults: getGrepTaskResults(),
  addListArchiveTask: addListArchiveTask(listArchive({ checkArchivePaths })),
  getListArchiveTaskResults: getListArchiveResults(),
};

await serve(routing(dependencies), {
  port: PORT,
});
