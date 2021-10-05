import React, { useState, useEffect } from 'react'

import reduce from 'lodash/reduce'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Input from '../Input'
import { ACCEPTED_CURRENCIES } from '../../constants/contribute'

const SETS = {
  account_name: {
    label: 'Account name',
  },
  account_number: {
    label: 'Account number',
  },
  bank_name: {
    label: 'Bank name',
  },
  bank_address: {
    label: 'Bank address',
  },
  routing_number: {
    label: 'Routing number',
  },
  iban: {
    label: 'IBAN',
  },
  'swift/bic': {
    label: 'Swift/BIC',
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const AdminSettingsBank = ({
  bankSettings, settings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()
  const [currentCurrency, setCurrentCurrency] = useState(settings.base_currency)

  const [values, setValues] = useState(reduce(SETS, (memo, value, key) => {
    // eslint-disable-next-line no-param-reassign
    memo[key] = ((bankSettings || {})[currentCurrency] || {})[key] || ''
    return memo
  }, {}),)

  useEffect(() => {
    setValues(reduce(SETS, (memo, value, key) => {
      // eslint-disable-next-line no-param-reassign
      memo[key] = ((bankSettings || {})[currentCurrency] || {})[key] || ''
      return memo
    }, {}))
  }, [currentCurrency, setValues, bankSettings])

  const onUpdateBtnClick = () => {
    onUpdate({ bank: { ...bankSettings, [currentCurrency]: values } })
  }

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Currency</FormLabel>
        <RadioGroup aria-label="position" name="position" value={currentCurrency} onChange={(e) => setCurrentCurrency(e.target.value)} row>
          {ACCEPTED_CURRENCIES.filter((curr) => settings.accepted_currencies[curr]).map((currency) => (
            <FormControlLabel
              value={currency}
              control={<Radio color="primary" />}
              label={currency}
              labelPlacement="bottom"
            />
          ))}
        </RadioGroup>
      </FormControl>
      <br />
      <br />

      <Grid container spacing={2}>
        {
        Object.keys(values).map((item) => (
          <Grid
            item
            xs={12}
            md={6}
            key={item}
          >
            <Input
              propertyName={item}
              label={SETS[item].label}
              state={values}
              disabled={!editingAllowed}
              setState={setValues}
              error={error}
              loading={loading}
            />
          </Grid>
        ))
      }
      </Grid>
      {
        loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : (
            <Button disabled={!editingAllowed} variant="contained" color="primary" onClick={onUpdateBtnClick}>
              Update
            </Button>
          )
      }
    </>
  )
}

AdminSettingsBank.propTypes = {
  bankSettings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsBank
