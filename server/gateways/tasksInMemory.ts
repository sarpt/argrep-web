import { AddGrepTaskUC } from "../usecases/addGrepTask.ts";
import { GetGrepTaskResultsUC } from "../usecases/getGrepTaskResults.ts";
import { GrepArchivesUC, Hit } from "../usecases/grepArchive.ts";

enum TaskStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Done = "Done",
  Failed = "Failed",
}

type GrepRunner = ReturnType<GrepArchivesUC>;

type GrepTask = {
  id: string;
  errMsg?: string;
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
    if (previousResultsLength && previousResultsLength === task.results.length) continue;

    yield { hits: task.results, errMsg: task.errMsg };

    previousResultsLength = task.results.length;
  } while (task.status === TaskStatus.InProgress);

  return { hits: task.results, errMsg: task.errMsg };
}

async function runGrepTask(task: GrepTask) {
  task.status = TaskStatus.InProgress;

  for await (const result of task.grepRunner) {
    if (result.errMsg) {
      task.errMsg = result.errMsg;
      task.status = TaskStatus.Failed;
      return;
    }

    task.results.push(result);
  }

  task.status = TaskStatus.Done;
}

function timeout(msec?: number) {
  return new Promise((res) => {
    setTimeout(res, msec);
  });
}
