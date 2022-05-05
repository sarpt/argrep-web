import { readableStreamFromIterable } from "https://deno.land/std@0.136.0/streams/mod.ts";

import { AddGrepTaskUC } from "../usecases/addGrepTask.ts";
import {
  GetGrepTaskResultsUC,
  Results,
} from "../usecases/getGrepTaskResults.ts";

export const putGreps = (addGrepTask: AddGrepTaskUC) =>
  async (req: Request) => {
    const formData = await req.formData();

    const grepPatterns = formData.getAll("pattern").map((formValue) =>
      formValue.toString()
    );
    const paths = formData.getAll("path").map((formValue) =>
      formValue.toString()
    );

    const { id } = await addGrepTask({ paths, grepPatterns });
    const body = JSON.stringify({ id });

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  };

export const getSSEGreps = (getGrepTaskResults: GetGrepTaskResultsUC) =>
  async (req: Request) => {
    const params = new URLSearchParams(new URL(req.url).search);
    const id = params.get("id");

    if (!id) {
      return new Response("No id provided", {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const results = await getGrepTaskResults({ id });
    if (!results) {
      return new Response(`Grep task with provided id '${id}' not found`, {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const stream = readableStreamFromIterable(mapHitsToResponses(results));
    return new Response(stream, {
      status: 200,
      headers: new Headers({ "content-type": "text/event-stream" }),
    });
  };

async function* mapHitsToResponses(results: Results) {
  for await (const result of results) {
    const json = JSON.stringify(result);
    yield new TextEncoder().encode(`data:${json}\n\n`);
  }

  return new Uint8Array();
}
