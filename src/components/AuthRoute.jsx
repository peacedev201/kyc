import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useMe } from '../myHooks'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
}))

const AuthRoute = (props) => {
  const { loading, error } = useMe()
  const classes = useStyles()

  if (loading) {
    return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
  }

  if (error) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...props} />
  }

  return <Redirect to="/" />
}

export default AuthRoute
