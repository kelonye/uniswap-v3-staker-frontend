import { createMuiTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS } from 'config';

export default createMuiTheme({
  typography: {
    fontFamily: ['Source Code Pro', 'Helvetica', 'Arial', 'sans-serif'].join(
      ','
    ),
  },
  palette: {
    type: 'dark',
    background: {
      default: '#141414',
      paper: '#333',
    },
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: 'rgb(10, 153, 169)',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottomColor: '#313131',
        },
        '&:after': {
          borderBottomColor: '#313131',
        },
      },
    },
  },
});
