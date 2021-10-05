import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Switch } from 'react-router-dom'

import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useMe } from '../myHooks'
import { hasUserEnoughRights } from '../utils'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
}))

const ProtectedZone = ({ children, urlToRedirect, minRights }) => {
  const classes = useStyles()
  const { error, loading, data: { me: user } = {} } = useMe()

  if (loading) {
    return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
  }

  if (error || !user) {
    return <Redirect to={urlToRedirect || '/login'} />
  }

  if (hasUserEnoughRights(user.rights, minRights) === false) {
    return <Redirect to={urlToRedirect || '/login'} />
  }

  return <Switch>{children}</Switch>
}

ProtectedZone.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
  children: PropTypes.object,
  // eslint-disable-next-line react/require-default-props
  urlToRedirect: PropTypes.string,
  minRights: PropTypes.string,
}

export default ProtectedZone
