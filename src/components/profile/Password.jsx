import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import InfoIcon from '@material-ui/icons/Info'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useCookies } from 'react-cookie'
import Input from '../Input'
import { CHANGE_PASSWORD_MUTATION } from '../../queriesAndMutations'
import { logout } from '../../utils'

const useStyles = makeStyles(() => ({
  info: {
    color: 'rgba(27, 171, 254, 0.9)',
  },
}))


const Password = () => {
  const classes = useStyles()
  const [, setCookie] = useCookies(['jwt'])
  const [changePassword, { error, loading }] = useMutation(CHANGE_PASSWORD_MUTATION)
  const initialValues = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  }

  const [value, setValue] = useState(initialValues)

  const isDataUpToDate = () => {
    const notEmptyField = Object.keys(value).find((fieldName) => value[fieldName] !== '')
    return Boolean(!notEmptyField)
  }


  const submit = async (e) => {
    e.preventDefault()
    await changePassword({ variables: { input: value } })
    setCookie('jwt', '', { path: '/' })
    logout()()
    setValue(initialValues)
  }

  return (
    <form onSubmit={submit}>
      <Grid container spacing={4}>
        <Grid item md={6}>
          <div className="input-item input-with-label">
            <Input propertyName="old_password" label="Old Password" state={value} setState={setValue} type="password" error={error} loading={loading} />
          </div>
        </Grid>

      </Grid>


      <Grid container spacing={4}>
        <Grid item md={6}>
          <div className="input-item input-with-label">
            <Input propertyName="new_password" label="New Password" state={value} setState={setValue} type="password" error={error} loading={loading} />
          </div>
        </Grid>

        <Grid item md={6}>
          <div className="input-item input-with-label">
            <Input propertyName="confirm_password" label="Confirm New Password" state={value} setState={setValue} type="password" error={error} loading={loading} />
          </div>
        </Grid>
      </Grid>


      <div>
        <p className={classes.info}>
          <InfoIcon fontSize="inherit" />
          {' '}
Password should be minmum 8 letter and include lower and uppercase letter.
          {' '}
          <br />
You will be automatically logged out once the password is changed.
        </p>
      </div>

      <div className="gaps-1x" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <button type="submit" className="btn btn-primary">Update</button>
        <div className="gaps-2x d-sm-none" />
        {isDataUpToDate() && (
        <span className="text-success">
          <CheckBoxIcon fontSize="inherit" />
          {' '}
All Changes are saved
        </span>
        )}
      </Box>
    </form>
  )
}

export default Password
