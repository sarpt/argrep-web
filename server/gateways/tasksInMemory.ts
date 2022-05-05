import { AddGrepTaskUC } from "../usecases/addGrepTask.ts";
import { GetGrepTaskResultsUC } from "../usecases/getGrepTaskResults.ts";
import { GrepArchivesUC, Hit } from "../usecases/grepArchive.ts";

enum TaskStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Done = "Done",
}

type GrepRunner = AsyncGenerator<Hit, { hits: Hit[] }, void>;

type GrepTask = {
  id: string;
  results: Hit[];
  status: TaskStatus;
  grepRunner: GrepRunner;
};

const grepTasks = new Map<string, GrepTask>();
let id = 0;

export const addGrepTask: (grepArchives: GrepArchivesUC) => AddGrepTaskUC = (
  grepArchives,
) =>
  ({ grepPatterns, paths }) => {
    const taskId = `${id++}`;

    grepTasks.set(taskId, {
      id: taskId,
      results: [],
      status: TaskStatus.NotStarted,
      grepRunner: grepArchives({ grepPatterns, paths }),
    });

    return Promise.resolve({ id: taskId });
  };

export const getGrepTaskResults: () => GetGrepTaskResultsUC = () =>
  ({ id }) => {
    const task = grepTasks.get(id);
    if (!task) return Promise.resolve(task);

    if (task.status === TaskStatus.NotStarted) runGrepTask(task);

    const poller = grepTaskResultsPoller(task);
    return Promise.resolve(poller);
  };

async function* grepTaskResultsPoller(task: GrepTask) {
  let previousResultsLength = 0;

  do {
    await timeout();
    if (previousResultsLength === task.results.length) continue;

    yield { hits: task.results };

    previousResultsLength = task.results.length;
  } while (task.status === TaskStatus.InProgress);

  return { hits: task.results };
}

async function runGrepTask(task: GrepTask) {
  task.status = TaskStatus.InProgress;

  for await (const result of task.grepRunner) {
    task.results.push(result);
  }

  task.status = TaskStatus.Done;
}

function timeout(msec?: number) {
  return new Promise((res) => {
    setTimeout(res, msec);
  });
}
