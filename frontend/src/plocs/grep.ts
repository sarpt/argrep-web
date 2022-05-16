import { startGrepUC } from '../domains/grep/usecases/startGrep';
import { getGrepResultsUC } from '../domains/grep/usecases/getGrepResults';
import { timeout } from './utils';
import { Hit } from '../domains/grep/entities/hit';

type dependencies = {
  startGrepUC: startGrepUC,
  getGrepResultsUC: getGrepResultsUC,
};

type RunGrepArguments = {
  pattern: string,
  path: string,
  onResults: (hits: Hit[]) => void,
  onError: (errMsg: string) => void,
  onDone: () => void,
};

export const getRunGrep = ({ startGrepUC, getGrepResultsUC }: dependencies) =>
  async ({ pattern, path, onResults, onError, onDone }: RunGrepArguments) => {
    const { taskId } = await startGrepUC({ pattern, path });

    let grepFinished = false;
    while (!grepFinished) {
      await timeout(300);
      const { hits, done, errMsg } = await getGrepResultsUC({ taskId });
      if (errMsg) {
        onError(errMsg);
        return;
      }

      onResults(hits);

      grepFinished = !!done;
    }

    onDone();
  };
