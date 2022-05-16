import { Button, TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Hit } from './domains/grep/entities/hit';

import { getGateways } from './gateways/grep/grepWithArgrepSSE';
import { getRunGrep } from './plocs/grep';

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
      <TextField
        placeholder='Path'
        onChange={(ev) => setPath(ev.target.value) }
        value={path}
      />
      <TextField
        placeholder='Grep pattern'
        onChange={(ev) => setGrepPattern(ev.target.value) }
        value={grepPattern}
      />
      <Button onClick={onGrep}>Grep</Button>
      { greppingInProgress ? <span>Grepping...</span> : <></>}
      {
        grepResults.map((result, idx) => (
          <span key={idx}>{result.path}, line {result.line}: ${result.match}</span>
        ))
      }
    </div>
  );
}

export default App;
