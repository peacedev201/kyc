import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'

import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

import { extractMsgFromErrByPropertyName } from '../utils'

import { RESTORE } from '../queriesAndMutations'

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
}))

const PasswordRestorForm = () => {
  const classes = useStyles()
  const [restore, { data, loading, error }] = useMutation(RESTORE)
  const [values, setValues] = useState({
    email: '',
  })

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const onRestoreBtnClick = () => {
    setValues({ ...values, email: '' })
    restore({ variables: { input: values } })
  }

  const renderInputField = ({
    // eslint-disable-next-line react/prop-types
    propertyName, label = '', index, type,
  } = {}) => {
    const errorsTexts = extractMsgFromErrByPropertyName(error, propertyName)

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
          disabled={loading}
          fullWidth
        />
      </div>
    )
  }

  if (data) {
    return (
      <>
        <h2 className="page-ath-heading">
        Password reset link sent
          {' '}
          <span className="text-success">
              Please check your mail.
          </span>
        </h2>
      </>
    )
  }

  return (
    <>
      <h2 className="page-ath-heading">
      Reset password
        <span>
              If you forgot your password, well,
              then we’ll email you instructions to reset your password.
        </span>
      </h2>
      {
        loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : (
            <>
              <div className="input-item">
                {
                renderInputField({
                  propertyName: 'email',
                  label: 'Your email',
                })
              }
              </div>
              <div className={classes.itemBar}>
                <div>
                  <button onClick={onRestoreBtnClick} type="button" className="btn btn-primary btn-block">Send Reset Link</button>
                </div>
                <div>
                  <Link to="/login">Return to login</Link>
                </div>
              </div>
            </>
          )
      }
      <div className="gaps-2x" />

    </>
  )
}

PasswordRestorForm.propTypes = {
  // from HOCs
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default PasswordRestorForm
