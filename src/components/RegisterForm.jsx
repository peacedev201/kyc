import React, { useState } from 'react'
import {
  Link, withRouter,
  Redirect,
} from 'react-router-dom'

import { compose } from 'recompose'
import { useMutation } from '@apollo/react-hooks'
import omit from 'lodash/omit'

import '../styles/legacy/style.scss'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { extractMsgFromErrByPropertyName } from '../utils'

import { REGISTRATION } from '../queriesAndMutations'
import { usePublicSettings } from '../myHooks/useSettings'


const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const RegistrationForm = ({ match }) => {
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()
  const classes = useStyles()
  const [registration, { data, loading, error }] = useMutation(REGISTRATION)
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    password_confirm: '',
    isConfirmPolicy: false,
  })

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const onCreateBtnClick = () => {
    if (!values.isConfirmPolicy) {
      return
    }

    const registerData = omit(values, 'isConfirmPolicy')

    setValues({ ...values, password: '', password_confirm: '' })
    registration({ variables: { input: registerData } })
  }

  const onChangeCheckbox = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked })
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

  const renderRegistration = () => {
    if (data) {
      const urlRedirect = `/register-success/${data.registration.id}`
      return <Redirect push to={urlRedirect || '/'} />
    }
    if (match.params.userId) {
      return (
        <div>
          <h2 className="page-ath-heading">
            Thank you!
            <small>Your singup process is almost done.</small>
            {' '}
            <span className="text-success">
              Please check your mail and verify.
            </span>
          </h2>
        </div>
      )
    }

    return (
      <>
        <h2 className="page-ath-heading">
          Sign up
          <small>
Create New
            {(company || {}).name}
            {' '}
Account
          </small>
        </h2>

        {renderInputField({
          propertyName: 'firstName',
          label: 'Your name',
        })}
        {renderInputField({
          propertyName: 'lastName',
          label: 'Your surname',
        })}
        {renderInputField({
          propertyName: 'middleName',
          label: 'Your middle name',
        })}
        {renderInputField({
          propertyName: 'email',
          label: 'Your email',
        })}
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
        <div className="input-item text-left">
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.isConfirmPolicy}
                onChange={onChangeCheckbox('isConfirmPolicy')}
                color="default"
                value="isConfirmPolicy"
              />
            )}
            label={(
              <label htmlFor="term-condition">
                I agree to
                {' '}
                {(company || {}).name}
’s
                {' '}
                <Link to="/privacy-policy">Privacy Policy</Link>
                {' '}
                &amp;
                <Link to="/terms"> Terms.</Link>
              </label>
            )}
          />
        </div>
        {
          loading
            ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
            : <button disabled={!values.isConfirmPolicy} type="button" onClick={onCreateBtnClick} className="btn btn-primary btn-block">Create Account</button>
        }
      </>
    )
  }

  return renderRegistration()
}

export default compose(
  withRouter
)(RegistrationForm)
