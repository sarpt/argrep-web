import { TextField } from '@material-ui/core';
import React, { useState } from 'react';

import './App.css';

function App() {
  const [grepPattern, setGrepPattern] = useState<string>('');

  return (
    <div className="App">
      <TextField
        placeholder='Grep pattern'
        onChange={(ev) => setGrepPattern(ev.target.value) }
        value={grepPattern}
      />
    </div>
  );
}

export default App;
