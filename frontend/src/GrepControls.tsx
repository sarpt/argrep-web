import React from 'react';

import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';

type Props = {
  grepPattern: string,
  onGrep: () => void,
  path: string,
  setGrepPattern: (pattern: string) => void,
  setPath: (path: string) => void,
};

export const GrepControls = ({ grepPattern, onGrep, path, setPath, setGrepPattern }: Props) => {
  return (
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          label='Path'
          placeholder='Path to a file to be searched'
          onChange={(ev) => setPath(ev.target.value) }
          value={path}
          variant='outlined'
        />
        <div style={{ height: '10px' }} />
        <TextField
          label='Pattern'
          placeholder='Pattern to grep'
          onChange={(ev) => setGrepPattern(ev.target.value) }
          value={grepPattern}
          variant='outlined'
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={onGrep}
          color='primary'
          variant="contained"
        >
          Grep
        </Button>
      </CardActions>
    </Card>
  );
};
