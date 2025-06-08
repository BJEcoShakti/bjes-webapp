import * as React from 'react';
import Typography from '@mui/material/Typography';
import SessionContext from '../SessionContext';

export default function HomePage() {
  
  const context = React.useContext(SessionContext);

  console.log(context);

  return (    
      <Typography>
        Welcome to Toolpad Core!
      </Typography>
  );
}
