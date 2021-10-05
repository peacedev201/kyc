import React, { useEffect } from 'react'
import {
  Redirect, withRouter,
} from 'react-router-dom'

import { compose } from 'recompose'
import { useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'

import '../styles/legacy/style.scss'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { FIRST_LOGIN } from '../queriesAndMutations'


const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const FirstLogin = ({ history }) => {
  const classes = useStyles()
  const [firstLogin, { data, loading, error }] = useMutation(FIRST_LOGIN)

  const query = queryString.parse(history.location.search)
  const firstAuthToken = (query || {}).first_auth_token

  useEffect(() => {
    firstLogin({ variables: { first_auth_token: firstAuthToken } })
  }, [firstLogin, firstAuthToken])

  if (data) {
    localStorage.setItem('jwt', data.firstLogin.accessToken)
    return <Redirect to="/application" />
  }

  if (error) {
    return (
      <div className="page-ath-text">
        <div className="alert alert-warning">Login error</div>
        <div className="gaps-0-5x" />
      </div>
    )
  }

  return (
    <div className="page-ath-text">
      { loading && (
      <>
        <div className="alert alert-info">Login in progress</div>
        <div className="gaps-0-5x" />
      </>
      )}
      <div className={classes.circularProgressWrapper}><CircularProgress /></div>
    </div>
  )
}

export default compose(
  withRouter
)(FirstLogin)
