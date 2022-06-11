import { startGrepUC } from '../../domains/grep/usecases/startGrep';
import { getGrepResultsUC } from '../../domains/grep/usecases/getGrepResults';
import { Hit } from '../../domains/grep/entities/hit';

const apiAdress = 'http://localhost:8080';

const startGrep: startGrepUC = async ({ pattern, path }) => {
  const requestUrl = `${apiAdress}/greps`;

  const formData = new FormData();
  formData.set('pattern', pattern);
  formData.set('path', path);

  const Response = await fetch(requestUrl, { method: 'PUT', body: formData });
  const { id } = await Response.json();

  return {
    taskId: id
  }
};

type task = sseGrepResultsResponse & {
  eventSource: EventSource,
};

type sseGrepResultsResponse = {
  hits: Hit[],
  done: boolean,
  errMsg?: string,
};

const tasks = new Map<string, task>();
const getGrepResults: getGrepResultsUC = async ({ taskId }) => {
  let task = tasks.get(taskId);
  if (!task) {
    const requestUrl = `${apiAdress}/sse/greps?id=${taskId}`;

    const grepEventSource = new EventSource(requestUrl);
    task = {
      eventSource: grepEventSource,
      hits: [],
      done: false,
    };
    tasks.set(taskId, task);

    grepEventSource.addEventListener('error', (ev) => {
      if (task!.done) return;

      task!.done = true;  
      task!.errMsg = 'argrep disconnected';
      grepEventSource.close();
    });

    grepEventSource.addEventListener('finished', (ev) => {
      task!.done = true;  
      grepEventSource.close();
    });

    grepEventSource.addEventListener('results', (ev) => {
      const { hits, errMsg } = JSON.parse(ev.data) as sseGrepResultsResponse;
      
      task!.hits = hits;
      task!.errMsg = errMsg;
    });
  }

  return {
    hits: task.hits,
    done:  task.done,
    errMsg: task.errMsg,
  }
};

export const getGateways = () => {
  return {
    startGrep,
    getGrepResults,
  };
}
