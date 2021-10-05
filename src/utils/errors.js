import isEmpty from 'lodash/isEmpty'

// eslint-disable-next-line import/prefer-default-export
export const extractMsgFromErrByPropertyName = (error, propertyName = '') => {
  if (!propertyName) {
    return []
  }

  if (isEmpty(error)) {
    return []
  }

  const currentPropertyError = (
    error.graphQLErrors
      .find((v) => v.extensions.exception.errors && Object.keys(v.extensions.exception.errors).includes(propertyName))
  ) || {}

  return (
    currentPropertyError && currentPropertyError.extensions
    && currentPropertyError.extensions.exception && currentPropertyError.extensions.exception.errors[propertyName]
  ) || []
}

export const extractMsgFromGraphqlError = (graphqlError) => {
  if (isEmpty(graphqlError)) {
    return []
  }

  const errors = []

  if (
    graphqlError.extensions
    && graphqlError.extensions.exception
    && typeof graphqlError.extensions.exception.errors === 'object'
  ) {
    Object.keys(graphqlError.extensions.exception.errors).forEach((key) => {
      errors.push(graphqlError.extensions.exception.errors[key])
    })
  }

  return errors
}
