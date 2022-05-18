import { Card, CardContent, LinearProgress, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

import { Hit } from './domains/grep/entities/hit';

type Props = {
  inProgress: boolean,
  results: Hit[],
};

export const GrepResults = ({ inProgress, results }: Props) => {
  return (
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
        { inProgress ? <span>Grep in progress... <LinearProgress /></span> : <></>}
        <List component="nav" aria-label="secondary mailbox folders">
          {
            results.map((result, idx) => (
              <ListItem button>
                <ListItemText secondary={`${result.path}, line ${result.line}`} primary={result.match} />
              </ListItem>
              // <span key={idx}>{result.path}, line {result.line}: {result.match}</span>
            ))
          }
        </List>
      </CardContent>
    </Card>
  );
};
