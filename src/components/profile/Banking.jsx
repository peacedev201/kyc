import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'

import PhoneInput from 'react-phone-input-2'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Box from '@material-ui/core/Box'
import InfoIcon from '@material-ui/icons/Info'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { toaster, extractMsgFromErrByPropertyName } from '../../utils'
import { CHANGE_BANK_INFO } from '../../queriesAndMutations'

import { MAIN_INFO_SCHEMA } from '../../schemas/banking'

const useStyles = makeStyles(() => ({
  info: {
    color: 'rgba(27, 171, 254, 0.9)',
  },
}))


const Banking = ({ userData }) => {
  const classes = useStyles()
  const [value, setValue] = useState({
    bankName: userData.bankName,
    iban: userData.iban,
    bankAddress: userData.bankAddress,
    sendingWithTransferwise: userData.sendingWithTransferwise,
    bankNameTransferwise: userData.bankNameTransferwise,
    bankAddressTransferwise: userData.bankAddressTransferwise,
    memberShipNumberTransferwise: userData.memberShipNumberTransferwise,
  })
  const [changeBankInfo, { error, loading }] = useMutation(CHANGE_BANK_INFO)

  const submit = async (e) => {
    e.preventDefault()
    await changeBankInfo({ variables: { input: value } }).then(() => {
      toaster.success('Success!')
      if (value.sendingWithTransferwise === false) {
        setValue({
          ...value, bankNameTransferwise: null, bankAddressTransferwise: null, memberShipNumberTransferwise: null,
        })
      }
    })
  }
  const handleChange = (name, state, setState) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const handleChangeCheckBox = (propertyName) => (event) => {
    setValue({ ...value, [propertyName]: event.target.checked })
  }

  const renderInputField = ({
    // eslint-disable-next-line react/prop-types
    propertyName, label = '', type = 'text', isRequired, helperText, state, setState, disabled = false, setter = null, labelPostfix = null, options = [],
  } = {}) => {
    const errorsTexts = extractMsgFromErrByPropertyName(error, propertyName)

    let input = null

    switch (type) {
      case 'phone':
        input = (
          <>
            <PhoneInput
              defaultCountry="us"
              onChange={setter || ((value) => { setState({ ...state, [propertyName]: value }) })}
              variant="outlined"
              disabled={disabled || loading}
              fullWidth
              value={state[propertyName] || ''}
            />
            <FormHelperText error={errorsTexts.length !== 0}>{helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}</FormHelperText>
          </>
        )
        break
      case 'select':
        input = (
          <TextField
            className="input-bordered"
            select
            value={state[propertyName] || ''}
            onChange={setter || handleChange(propertyName, state, setState)}
            margin="none"
            variant="outlined"
            fullWidth
            error={errorsTexts.length !== 0}
            helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
            disabled={disabled || loading}
          >
            { options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
        )
        break
      case 'checkbox':
        input = (
          <FormControlLabel
            control={(
              <Checkbox
                checked={state[propertyName] || false}
                onChange={setter || handleChangeCheckBox(propertyName)}
                color="default"
                value="rememberMe"
              />
          )}
          />
        )
        break
      default:
        input = (
          <TextField
            id="outlined-name"
            className="input-bordered"
            value={state[propertyName] || ''}
            onChange={setter || handleChange(propertyName, state, setState)}
            margin="none"
            type={type}
            error={errorsTexts.length !== 0}
            helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
            variant="outlined"
            disabled={disabled || loading}
            fullWidth
          />
        )
    }

    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="input-item-label" key={`label-${propertyName}`}>
          { label }
          { isRequired && <span className="text-danger"> *</span>}
          {labelPostfix}
        </label>
        <div className="input-item" key={propertyName}>
          {input}
        </div>
      </>
    )
  }


  return (
    <form onSubmit={submit}>
      <h4 className="text-secondary mgt-0-5x">Your Address</h4>
      <Grid container spacing={2}>
        {MAIN_INFO_SCHEMA && Object.keys(MAIN_INFO_SCHEMA).map((key) => (
          <>
            <Grid item md={6} xs={12} key={key}>
              {key === 'sendingWithTransferwise'
                ? renderInputField({
                  propertyName: key,
                  type: MAIN_INFO_SCHEMA[key].type || 'text',
                  label: MAIN_INFO_SCHEMA[key].label || '',
                  isRequired: MAIN_INFO_SCHEMA[key].isRequired || false,
                  state: value,
                  setState: setValue,
                  setter: handleChangeCheckBox(key),
                })
                : renderInputField({
                  propertyName: key,
                  type: MAIN_INFO_SCHEMA[key].type || 'text',
                  label: MAIN_INFO_SCHEMA[key].label || '',
                  isRequired: MAIN_INFO_SCHEMA[key].isRequired || false,
                  state: value,
                  setState: setValue,
                })}
            </Grid>
            {(MAIN_INFO_SCHEMA[key].subItem && value[key] === true) && (
            <>
              {Object.keys(MAIN_INFO_SCHEMA[key].subItem).map((subKey) => (
                <Grid item md={6} xs={12} key={subKey}>
                  {
                            renderInputField({
                              propertyName: subKey,
                              type: MAIN_INFO_SCHEMA[key].subItem[subKey].type || 'text',
                              label: MAIN_INFO_SCHEMA[key].subItem[subKey].label || '',
                              isRequired: MAIN_INFO_SCHEMA[key].subItem[subKey].isRequired || false,
                              state: value,
                              setState: setValue,
                            })
                          }
                </Grid>
              ))}
            </>
            )}
          </>
        ))}
      </Grid>

      <div>
        <p className={classes.info}>
          <InfoIcon fontSize="inherit" />
          Please note that Transferwise has different Bankingpartners in each Jurisdiction, copy this data directly from the Transferwise app.
        </p>
      </div>

      <div className="gaps-1x" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <button type="submit" className="btn btn-primary">Update</button>
      </Box>
    </form>
  )
}

export default Banking
