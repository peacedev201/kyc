import { ApolloLink } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { toaster, extractMsgFromGraphqlError } from './utils'
import config from './config'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    setTimeout(() => {
      graphQLErrors.forEach((value) => {
        // eslint-disable-next-line no-console
        const gqlErrors = extractMsgFromGraphqlError(value)
        gqlErrors.forEach((error) => toaster.error(`${error}`))

        console.log('[GraphQL error]: ', value)
        // toaster.error(`[GraphQL error]: ${(value || {}).message}`)
      })
    }, 100)
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`)
    toaster.error(`[Network error]: ${networkError.message}`)
  }
})

const uploadLink = createUploadLink({
  uri: config.endpoint,
})

const headersMiddleware = setContext(({ headers = {} }) => ({
  headers: {
    ...headers,
    authorization: localStorage.getItem('jwt')
      ? localStorage.getItem('jwt')
      // eslint-disable-next-line
      : document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
  },
}))

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    headersMiddleware,
    uploadLink,
  ]),
  cache: new InMemoryCache(),
})

export default client
