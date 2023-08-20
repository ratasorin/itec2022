import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiTouchRipple: {
      defaultProps: {
        style: {
          opacity: 0.4,
        },
      },
    },
  },
  typography: {
    fontFamily: 'monospace',
  },
});
