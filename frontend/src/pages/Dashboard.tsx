
import React, { useCallback, useState } from 'react';
import { Hit } from '../domains/grep/entities/hit';

import { getGateways } from '../gateways/grep/grepWithArgrepSSE';
import { GrepControls } from '../GrepControls';
import { GrepResults } from '../GrepResults';
import { getRunGrep } from '../plocs/grep';

import './Dashboard.css';

const grepGateways = getGateways();
const grepPloc = getRunGrep({ startGrepUC: grepGateways.startGrep, getGrepResultsUC: grepGateways.getGrepResults });

type Props = {};
export const Dashboard = (props: Props) => {
  const [grepPattern, setGrepPattern] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [grepResults, setGrepResults] = useState<Hit[]>([]);
  const [greppingInProgress, setGreppingInProgress] = useState<boolean>(false);

  const onResults = useCallback((results: Hit[]) => {
    setGrepResults(results);
  }, []);

  const onDone = useCallback(() => {
    setGreppingInProgress(false);
  }, []);

  const onError = useCallback(() => {
    setGreppingInProgress(false);
    console.log('oh boy error has happened');
  }, []);

  const onGrep = useCallback(() => {
    setGreppingInProgress(true);
    grepPloc({ pattern: grepPattern, path, onResults, onDone, onError });
  }, [grepPattern, path]);

  return (
    <div className="Dashboard">
      <GrepControls
        grepPattern={grepPattern}
        onGrep={onGrep}
        path={path}
        setGrepPattern={setGrepPattern}
        setPath={setPath}
      />
      <div style={{ height: '10px' }} />
      <GrepResults
        inProgress={greppingInProgress}
        results={grepResults}
      />
    </div>
  );
};