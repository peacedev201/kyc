import React from 'react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

import makeStyles from '@material-ui/core/styles/makeStyles'
import { SOURCE_OF_FUNDS_SCHEMAS } from '../schemas/kycVerification'
import { SOURCE_OF_FUNDS } from '../constants/customer'

const useStyles = makeStyles(() => ({
  marginBottom: {
    marginBottom: '20px',
  },
}))

const KycVerificationFormSourceOfFunds = ({
  values, setValues, disabled = false, loading, handleChange,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.marginBottom}>
      <FormControl>
        <RadioGroup value={(values || {}).sourceOfFunds} onChange={({ target: { value } }) => setValues({ ...values, sourceOfFunds: value })}>
          {Object.keys(SOURCE_OF_FUNDS_SCHEMAS).map((key) => (
            <FormControlLabel key={key} label={SOURCE_OF_FUNDS_SCHEMAS[key].label} value={key.toUpperCase()} control={<Radio color="primary" />} />))}
        </RadioGroup>
        {(values || {}).sourceOfFunds === SOURCE_OF_FUNDS.OTHER && (
          <TextField
            id="outlined-name"
            className="input-bordered"
            value={values.sourceOfFundsOther || ''}
            onChange={handleChange('sourceOfFundsOther', values, setValues)}
            margin="none"
            type="text"
            variant="outlined"
            disabled={disabled || loading}
            fullWidth
          />
        )}
      </FormControl>
    </div>
  )
}

KycVerificationFormSourceOfFunds.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default KycVerificationFormSourceOfFunds
