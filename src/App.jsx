import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router-dom'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { ApolloProvider } from '@apollo/react-hooks'
import { CookiesProvider } from 'react-cookie'
import Root from './Root'
import history from './historyStore'


const App = ({ apolloClient }) => (
  <>
    <CookiesProvider>
      <Router history={history}>
        <ApolloProvider client={apolloClient}>
          <Root />
        </ApolloProvider>
      </Router>
      <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore} />
    </CookiesProvider>
  </>
)

App.propTypes = {
  apolloClient: PropTypes.object.isRequired,
}

export default App
