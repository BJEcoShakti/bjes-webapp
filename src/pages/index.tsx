import * as React from 'react';
import Typography from '@mui/material/Typography';
import SessionContext from '../SessionContext';

export default function HomePage() {
  const context = React.useContext(SessionContext);

  return <Typography>Welcome to Toolpad Core!</Typography>;
}
