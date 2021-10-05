import React from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h3: {
      fontSize: 42,
      fontWeight: 200,
    },
  },
  app: {
    purple: {
      main: '#5e55b8',
      light: '#7668fe',
      dark: '#342d6e',
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        '& label': {
          fontSize: '1em',
        },
        '& .MuiOutlinedInput-input': {
          padding: '15px 10px',
        },
      },
    },
  },
})

export default function Theme(props) {
  const { children } = props

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      { children }
    </MuiThemeProvider>
  )
}
