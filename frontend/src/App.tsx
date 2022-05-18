import React, { useCallback, useState } from 'react';
import { Hit } from './domains/grep/entities/hit';

import { getGateways } from './gateways/grep/grepWithArgrepSSE';
import { getRunGrep } from './plocs/grep';

import { GrepControls } from './GrepControls';
import { GrepResults } from './GrepResults';

import './App.css';

const grepGateways = getGateways();
const grepPloc = getRunGrep({ startGrepUC: grepGateways.startGrep, getGrepResultsUC: grepGateways.getGrepResults });

function App() {
  const [grepPattern, setGrepPattern] = useState<string>('');
  const [path, setPath] = useState<string>('');
  const [grepResults, setGrepResults] = useState<Hit[]>([]);
  const [greppingInProgress, setGreepingInProgress] = useState<boolean>(false);

  const onResults = useCallback((results: Hit[]) => {
    setGrepResults(results);
  }, []);

  const onDone = useCallback(() => {
    setGreepingInProgress(false);
  }, []);

  const onError = useCallback(() => {
    setGreepingInProgress(false);
    console.log('oh boy error has happened');
  }, []);

  const onGrep = useCallback(() => {
    setGreepingInProgress(true);
    grepPloc({ pattern: grepPattern, path, onResults, onDone, onError });
  }, [grepPattern, path]);

  return (
    <div className="App">
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
}

export default App;
