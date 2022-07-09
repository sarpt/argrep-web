import { AddGrepTaskUC } from "../usecases/addGrepTask.ts";
import { AddListArchiveTaskUC } from "../usecases/addListArchiveTask.ts";
import { GetGrepTaskResultsUC } from "../usecases/getGrepTaskResults.ts";
import { GetListArchiveTaskResultsUC } from "../usecases/getListArchiveTaskResults.ts";
import { GrepArchivesUC, Hit } from "../usecases/grepArchive.ts";
import { Entry, ListArchiveUC } from "../usecases/listArchive.ts";

enum TaskStatus {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Done = "Done",
  Failed = "Failed",
}

type GrepRunner = ReturnType<GrepArchivesUC>;
type listArchiveRunner = ReturnType<ListArchiveUC>;

type Task = {
  id: string;
  errMsg?: string;
  status: TaskStatus;
};

type GrepTask = {
  results: Hit[];
  grepRunner: GrepRunner;
} & Task;

type ListArchiveTask = {
  results: Entry[];
  runner: listArchiveRunner;
} & Task;

const grepTasks = new Map<string, GrepTask>();
const listArchiveTasks = new Map<string, ListArchiveTask>();

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
    if (!task.errMsg && previousResultsLength === task.results.length) continue;

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

export const addListArchiveTask: (
  listArchive: ListArchiveUC,
) => AddListArchiveTaskUC = (
  listArchive,
) =>
  ({ path }) => {
    const taskId = `${id++}`;

    listArchiveTasks.set(taskId, {
      id: taskId,
      results: [],
      status: TaskStatus.NotStarted,
      runner: listArchive({ path }),
    });

    return Promise.resolve({ id: taskId });
  };

export const getListArchiveResults: () => GetListArchiveTaskResultsUC = () =>
  ({ id }) => {
    const task = listArchiveTasks.get(id);
    if (!task) return Promise.resolve(task);

    if (task.status === TaskStatus.NotStarted) runListArchiveTask(task);

    const poller = listArchiveTaskResultsPoller(task);
    return Promise.resolve(poller);
  };

async function* listArchiveTaskResultsPoller(task: ListArchiveTask) {
  let previousResultsLength = 0;

  do {
    await timeout();
    if (!task.errMsg && previousResultsLength === task.results.length) continue;

    yield { entries: task.results, errMsg: task.errMsg };

    previousResultsLength = task.results.length;
  } while (task.status === TaskStatus.InProgress);

  return { entries: task.results, errMsg: task.errMsg };
}

async function runListArchiveTask(task: ListArchiveTask) {
  task.status = TaskStatus.InProgress;

  for await (const result of task.runner) {
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
