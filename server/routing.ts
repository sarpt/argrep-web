import { Handler } from "https://deno.land/std@0.135.0/http/mod.ts";
import { router } from "https://crux.land/api/get/2KNRVU.ts";
import { getSSEGreps, putGreps } from "./handlers/greps.ts";

import { AddGrepTaskUC } from "./usecases/addGrepTask.ts";
import { GetGrepTaskResultsUC } from "./usecases/getGrepTaskResults.ts";

export type dependencies = {
  addGrepTask: AddGrepTaskUC;
  getGrepTaskResult: GetGrepTaskResultsUC;
};

export const routing: (deps: dependencies) => Handler = (deps) =>
  (req) => {
    const handler = router({
      "GET@/sse/greps": getSSEGreps(deps.getGrepTaskResult),
      "OPTIONS@/sse/greps": () => { return new Response("", {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        },
      }) },
      "PUT@/greps": putGreps(deps.addGrepTask),
      "OPTIONS@/greps": () => { return new Response("", {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT"
        },
      }) },
    });

    return handler(req);
  };
