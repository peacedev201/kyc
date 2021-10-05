import React from 'react'
import PropTypes from 'prop-types'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
  bar: {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
  },
}))

const ErrorSnackBar = ({ error }) => {
  const classes = useStyles()

  const renderSnackBar = (value, i) => (
    value.message && (
    <SnackbarContent
      key={i}
      className={classes.snackbar}
      message={value.message}
    />
    )
  )

  if (!error) {
    return false
  }

  return (
    <div className={classes.bar}>
      {
        (error && error.graphQLErrors)
        && error.graphQLErrors.map(renderSnackBar)
      }
    </div>
  )
}

ErrorSnackBar.propTypes = {
  error: PropTypes.object,
}

export default ErrorSnackBar
