import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import { compose } from 'recompose'
import classNames from 'classnames'

import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

import queryString from 'query-string'
import { extractMsgFromErrByPropertyName } from '../utils'

import { RESTORE_CHECK, RESTORE_CONFIRM } from '../queriesAndMutations'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkToLoginPage: {
    width: '100%',
  },
}))

const PasswordRestoreConfirmForm = ({ history }) => {
  const classes = useStyles()
  const [restoreCheck, restoreCheckData] = useMutation(RESTORE_CHECK)
  const [restoreConfirm, restoreConfirmData] = useMutation(RESTORE_CONFIRM)
  const [values, setValues] = useState({
    password: '',
    password_confirm: '',
    token: '',
  })

  const query = queryString.parse(history.location.search)
  const token = query && query.token

  useEffect(() => {
    restoreCheck({ variables: { input: { token } } })
  }, [restoreCheck, token])

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }
  const onClick = () => {
    setValues({ ...values, password_confirm: '' })
    restoreConfirm({ variables: { input: { ...values, token } } })
  }
  const renderInputField = ({
    // eslint-disable-next-line react/prop-types
    propertyName, label = '', index, type,
  } = {}) => {
    const errorsTexts = extractMsgFromErrByPropertyName(restoreConfirmData.error, propertyName)

    return (
      <div className="input-item" key={index}>
        <TextField
          id="outlined-name"
          label={label}
          className="input-bordered"
          value={values[propertyName] || ''}
          onChange={handleChange(propertyName)}
          margin="none"
          type={type}
          error={errorsTexts.length !== 0}
          helperText={(errorsTexts && errorsTexts.join('. ')) || ''}
          variant="outlined"
          disabled={restoreConfirmData.loading}
          fullWidth
        />
      </div>
    )
  }

  if (restoreConfirmData.data) {
    return (
      <div className="page-ath-text">
        <div className="alert alert-success">Your password has been successfully changed.</div>
        <div className="gaps-0-5x" />
        <NavLink to="/login" className={classNames('btn btn-primary', classes.linkToLoginPage)}>Sign in</NavLink>
      </div>
    )
  }

  if (restoreCheckData.data) {
    return (
      <>
        <h2 className="page-ath-heading">
          Create new password
        </h2>

        {renderInputField({
          propertyName: 'password',
          label: 'Password',
          type: 'password',
        })}
        {renderInputField({
          propertyName: 'password_confirm',
          label: 'Repeat Password',
          type: 'password',
        })}
        {
          restoreConfirmData.loading
            ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
            : <button type="button" onClick={onClick} className="btn btn-primary btn-block">Reset Password</button>
        }
      </>
    )
  }

  return (
    <>
      <h2 className="page-ath-heading">
        Reset password
      </h2>
      {
        restoreCheckData.loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : (
            <div className="alert alert-warning">
              Invalid password recovery link.
              {' '}
              <br />
              <NavLink to="/password/restore">Go to the password recovery page</NavLink>
            </div>
          )


      }
      <div className="gaps-2x" />
    </>
  )
}

PasswordRestoreConfirmForm.propTypes = {
  // from HOCs
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default compose(
  withRouter
)(PasswordRestoreConfirmForm)
