import { readableStreamFromIterable } from "https://deno.land/std@0.136.0/streams/mod.ts";

import { AddListArchiveTaskUC } from "../usecases/addListArchiveTask.ts";
import {
  GetListArchiveTaskResultsUC,
  Results,
} from "../usecases/getListArchiveTaskResults.ts";

export const putArchiveList = (addListArchiveTask: AddListArchiveTaskUC) =>
  async (req: Request) => {
    const formData = await req.formData();

    const path = formData.getAll("path").map((formValue) =>
      formValue.toString()
    )[0];

    const { id } = await addListArchiveTask({ path });
    const body = JSON.stringify({ id });

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT",
      },
    });
  };

export const getSSEArchiveLists = (
  getListArchiveTaskResults: GetListArchiveTaskResultsUC,
) =>
  async (req: Request) => {
    const params = new URLSearchParams(new URL(req.url).search);
    const id = params.get("id");

    if (!id) {
      return new Response("No id provided", {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      });
    }

    const results = await getListArchiveTaskResults({ id });
    if (!results) {
      return new Response(`Grep task with provided id '${id}' not found`, {
        status: 400,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      });
    }

    const stream = readableStreamFromIterable(mapEntriesToResponses(results));
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  };

const resultsEvent = "results";
const finishedEvent = "finished";

async function* mapEntriesToResponses(results: Results) {
  for await (const result of results) {
    const json = JSON.stringify(result);
    yield new TextEncoder().encode(`event:${resultsEvent}\ndata:${json}\n\n`);
  }

  yield new TextEncoder().encode(`event:${finishedEvent}\ndata:\n\n`);
}
