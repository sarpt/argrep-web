import { startGrepUC } from '../../../domains/grep/usecases/startGrep';
import { getGrepResultsUC } from '../../../domains/grep/usecases/getGrepResults';

type dependencies = {
  startGrepUC: startGrepUC,
  getGrepResultsUC: getGrepResultsUC,
};

export const getRunGrep = ({}: dependencies) => ({ pattern, onResults }: { pattern: string, onResults: () => void }) => {

};
