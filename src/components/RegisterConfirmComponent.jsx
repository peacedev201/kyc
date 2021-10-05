import React, { useEffect } from 'react'
import {
  NavLink, withRouter,
} from 'react-router-dom'

import { compose } from 'recompose'
import { useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'

import '../styles/legacy/style.scss'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { REGISTRATION_CONFIRM } from '../queriesAndMutations'


const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const RegistrationConfirm = ({ history }) => {
  const classes = useStyles()
  const [registrationConfirm, { data, loading, error }] = useMutation(REGISTRATION_CONFIRM)

  const query = queryString.parse(history.location.search)
  const registrationConfirmToken = query && query.token

  useEffect(() => {
    registrationConfirm({ variables: { input: { token: registrationConfirmToken } } })
  }, [registrationConfirm, registrationConfirmToken])

  if (data) {
    return (
      <div className="page-ath-text">
        <div className="alert alert-success">Your email is successfull verified.</div>
        <div className="gaps-0-5x" />
        <NavLink to="/login" className="btn btn-primary">Sign in</NavLink>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-ath-text">
        <div className="alert alert-warning">Email verify error</div>
        <div className="gaps-0-5x" />
      </div>
    )
  }

  return (
    <div className="page-ath-text">
      { loading && (
      <>
        <div className="alert alert-info">Email verification in progress</div>
        <div className="gaps-0-5x" />
      </>
      )}
      <div className={classes.circularProgressWrapper}><CircularProgress /></div>
    </div>
  )
}

export default compose(
  withRouter
)(RegistrationConfirm)
