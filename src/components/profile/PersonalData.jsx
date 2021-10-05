import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { useMutation } from '@apollo/react-hooks'
import pick from 'lodash/pick'
import FormHelperText from '@material-ui/core/FormHelperText'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/dist/style.css'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useMe } from '../../myHooks'
import { PERSONAL_DATA_MUTATION } from '../../queriesAndMutations'
import Input from '../Input'
import { extractMsgFromErrByPropertyName, toaster } from '../../utils'

const useStyles = makeStyles(() => ({
  input_border_date: {
    borderRadius: '4px',
    border: '1px solid #d2dde9',
    width: '100%',
    padding: '10px 15px',
    lineHeight: '20px',
    fontSize: '.9em',
    color: 'rgba(73, 84, 99, 0.7)',
    transition: 'all .4s',
    '&:focus': {
      boxShadow: 'none',
      outline: 'none',
      borderColor: '#b1becc',
    },
    '&:disabled': {
      background: 'rgba(230, 239, 251, 0.2)',
    },

    '~': {
      error: {
        color: '#ff6868',
        marginBottom: '0',
        position: 'relative',
        top: '7px',
      },
    },
  },
}))


const PersonalData = () => {
  const classes = useStyles()
  const { data: { me: userData }, refetch } = useMe()
  const [updatePersonalData, { loading, error }] = useMutation(PERSONAL_DATA_MUTATION)
  const [value, setValue] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    birth_date: '',
    ...userData,
  })


  const isDataUpToDate = () => {
    const mutableFields = ['phone', 'birth_date', 'first_name', 'last_name', 'middle_name']
    const changedField = Object.keys(pick(userData, mutableFields)).find((fieldName) => userData[fieldName] !== value[fieldName])
    return Boolean(!changedField)
  }

  const submit = async (e) => {
    e.preventDefault()
    const input = pick(value, ['birth_date', 'phone', 'first_name', 'last_name', 'middle_name'])
    await updatePersonalData({ variables: { input } })
    await refetch()
    toaster.success('Personal data were successfully updated')
  }

  const handleDateChange = (date) => setValue({
    ...value,
    birth_date: date !== null ? date.toString() : date,
  })


  const renderDatePicker = () => {
    const errorsTexts = extractMsgFromErrByPropertyName(error, 'birth_date')

    return (
      <div className="input-item input-with-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="input-item-label" key="birth_date">
            Your birth date
        </label>
        <div className="input-item">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              disableFuture
              variant="outlined"
              format="dd.MM.yyyy"
              margin="none"
              className={classes.input_border_date}
              id="date-picker-dialog"
              value={value.birth_date}
              error={errorsTexts.length !== 0}
              helperText={(errorsTexts && errorsTexts.join('. ')) || ''}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
    )
  }


  const renderPhoneInput = () => {
    const errorsTexts = extractMsgFromErrByPropertyName(error, 'phone')

    return (
      <div className="input-item input-with-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="input-item-label">
          Phone number
        </label>
        <div className="input-item">
          <PhoneInput
            defaultCountry="us"
            onChange={(valuePhone) => setValue({ ...value, phone: valuePhone })}
            variant="outlined"
            disabled={loading}
            fullWidth
            value={value.phone || 'sd'}
          />
          <FormHelperText error={errorsTexts.length !== 0}>{(errorsTexts && errorsTexts.join('. ')) || ''}</FormHelperText>
        </div>
      </div>
    )
  }


  return (
    <form onSubmit={submit}>
      <Grid container spacing={4}>
        <Grid item md={6}>
          <div className="input-item input-with-label">
            <Input propertyName="first_name" label="First name" state={value} setState={setValue} error={error} loading={loading} />
            <Input propertyName="last_name" label="Last name" state={value} setState={setValue} error={error} loading={loading} />
            <Input propertyName="middle_name" label="Middle name" state={value} setState={setValue} error={error} loading={loading} />
          </div>
        </Grid>

        <Grid item md={6}>
          <div className="input-item input-with-label">
            <Input propertyName="email" label="Email" state={value} setState={setValue} error={error} loading={loading} disabled />
          </div>
        </Grid>
      </Grid>


      <Grid container spacing={4}>
        <Grid item md={6}>
          <div className="input-item input-with-label">
            {renderPhoneInput()}
            {/* <Input propertyName="phone" label="Mobile number" state={value} setState={setValue} error={error} loading={loading} /> */}
          </div>
        </Grid>

        <Grid item md={6}>
          {renderDatePicker()}
        </Grid>
      </Grid>


      <div className="gaps-1x" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <button type="submit" className="btn btn-primary">Update Profile</button>
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

export default PersonalData
