import { Box, Card, CardContent, LinearProgress, List, ListItem, ListItemText } from '@material-ui/core';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import React from 'react';

import { Hit } from './domains/grep/entities/hit';

const rowHeight = 73;
const resultsListHeight = 400;
const overscan = 5;

type Props = {
  inProgress: boolean,
  results: Hit[],
};

function renderRow(props: ListChildComponentProps<Hit[]>) {
  const { index, style, data } = props;
  const title = data[index].match;
  const subtitle = `${data[index].path}, line ${data[index].line}`;

  return (
    <ListItem component="div" style={style} key={index} disableGutters>
      <ListItem button>
        <ListItemText
          primary={title}
          secondary={subtitle}
        />
      </ListItem>
    </ListItem>
  );
}

export const GrepResults = ({ inProgress, results }: Props) => {
  return (
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
        { inProgress ? <span>Grep in progress... <LinearProgress /></span> : <></>}
        <Box
          sx={{ width: '100%', height: resultsListHeight, bgcolor: 'background.paper' }}
        >
          <FixedSizeList
            itemData={results}
            width="100%"
            height={resultsListHeight}
            itemSize={rowHeight}
            itemCount={results.length}
            overscanCount={overscan}
          >
            {renderRow}
          </FixedSizeList>
        </Box>
      </CardContent>
    </Card>
  );
};
