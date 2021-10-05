import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import { useMutation } from '@apollo/react-hooks'
import pick from 'lodash/pick'
import classNames from 'classnames'


import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from './Input'

import { LOGIN, IS_2FA_NEEDED } from '../queriesAndMutations'

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

const LoginForm = ({ urlToRedirect }) => {
  const classes = useStyles()
  const [, setCookie] = useCookies(['jwt'])
  const [login, { loading, error: loginError, data }] = useMutation(LOGIN)
  const [checkIf2FANeeded, { error: twoFAError, data: { is2FANeeded } = {} }] = useMutation(IS_2FA_NEEDED)
  const error = twoFAError || loginError
  const [values, setValues] = useState({
    email: localStorage.getItem('email') || '',
    password: '',
    rememberMe: true,
    token_2fa: '',
  })


  const onChangeCheckbox = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked })
  }

  const onLoginBtnClick = async () => {
    localStorage.setItem('email', values.email)
    const loginData = { ...pick(values, 'email', 'password', 'is_2fa_enabled', 'token_2fa') }

    if (typeof is2FANeeded === 'undefined') {
      const { data: { is2FANeeded: needed2FA } } = await checkIf2FANeeded({ variables: { email: values.email } })
      if (needed2FA === false) {
        login({ variables: { input: loginData } })
        setValues({ ...values, password: '' })
      }
    } else {
      login({ variables: { input: loginData } })
      setValues({ ...values, password: '' })
    }
  }


  if (data && data.login && data.login.accessToken) {
    setCookie('jwt', data.login.accessToken, { path: '/' })
    localStorage.setItem('jwt', data.login.accessToken)

    return <Redirect to={urlToRedirect || '/'} />
  }

  return (
    <div>

      <Input propertyName="email" label="Your Email" state={values} setState={setValues} error={error} loading={loading} />
      <Input propertyName="password" label="Password" state={values} setState={setValues} type="password" error={error} loading={loading} />

      <div className="d-flex justify-content-between align-items-center">

        {is2FANeeded && <Input propertyName="token_2fa" label="Two-factor authentication token" state={values} setState={setValues} error={error} loading={loading} />}

        <div className={classNames('input-item text-left', classes.itemBar)}>

          <FormControlLabel
            control={(
              <Checkbox
                checked={values.rememberMe}
                onChange={onChangeCheckbox('rememberMe')}
                color="default"
                value="rememberMe"
              />
            )}
            label="Remember Me"
          />
          <Link to="/password/restore">Forgot password?</Link>
        </div>

      </div>
      {
        loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : <button onClick={onLoginBtnClick} type="button" className="btn btn-primary btn-block">Sign In</button>
      }
    </div>
  )
}

LoginForm.propTypes = {
  urlToRedirect: PropTypes.string,

  // from HOCs
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}

export default LoginForm
