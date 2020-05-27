import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from 'components/App'
import 'index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { resetGame } from 'redux/actions'
import { initialize } from 'redux/store'
import { hello } from 'utils/devtools'

hello()

const store = initialize()

store.dispatch(resetGame())

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: blue
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
