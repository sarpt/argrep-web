import { Handler } from "https://deno.land/std@0.135.0/http/mod.ts";
import { router } from "https://crux.land/api/get/2KNRVU.ts";
import { getSSEGreps, putGreps } from "./handlers/greps.ts";

import { getSSEArchiveLists, putArchiveList } from "./handlers/archiveLists.ts";
import { AddListArchiveTaskUC } from "./usecases/addListArchiveTask.ts";
import { GetListArchiveTaskResultsUC } from "./usecases/getListArchiveTaskResults.ts";
import { AddGrepTaskUC } from "./usecases/addGrepTask.ts";
import { GetGrepTaskResultsUC } from "./usecases/getGrepTaskResults.ts";

export type dependencies = {
  addGrepTask: AddGrepTaskUC;
  getGrepTaskResults: GetGrepTaskResultsUC;
  addListArchiveTask: AddListArchiveTaskUC;
  getListArchiveTaskResults: GetListArchiveTaskResultsUC;
};

export const routing: (deps: dependencies) => Handler = (deps) =>
  (req) => {
    const handler = router({
      "GET@/sse/greps": getSSEGreps(deps.getGrepTaskResults),
      "OPTIONS@/sse/greps": () => {
        return new Response("", {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
          },
        });
      },
      "PUT@/greps": putGreps(deps.addGrepTask),
      "OPTIONS@/greps": () => {
        return new Response("", {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT",
          },
        });
      },
      "GET@/sse/archives/lists": getSSEArchiveLists(
        deps.getListArchiveTaskResults,
      ),
      "OPTIONS@/sse/archives/lists": () => {
        return new Response("", {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
          },
        });
      },
      "PUT@/archives/lists": putArchiveList(deps.addListArchiveTask),
      "OPTIONS@/archives/lists": () => {
        return new Response("", {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT",
          },
        });
      },
    });

    return handler(req);
  };
