import React, { useState } from 'react'
import PropTypes from 'prop-types'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))

const AdminSettingsKYClvl = ({
  settings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const nameFields = {
    min_invest_amount: 'Minimum invest amount',
    max_invest_amount: 'Maximum invest amount',
    descriptionOfFunds: 'Description Of Funds',
    taxNumber: 'Tax number',
    taxOffice: 'Tax office',
    photoWithMeUpload: 'Upload photo proof document',
    proofOfResidenceUpload: 'Upload proof Residence',
    show_source_signup: 'Show source registered',
    mandatoryKYCOrganic: 'Mandatory KYC organic to create transaction',
    mandatoryKYCReferral: 'Mandatory KYC referral to create transaction ',
    acceptedFieldIndividualCrypto: 'Crypto',
    acceptedFieldIndividualFiat: 'Fiat',
    video_ident_value_individual: 'Video ident value (CHF) individual',
    video_ident_value_company: 'Video ident value (CHF) company',
  }

  const [kycLevels, setKycLevels] = useState({
    1: {
      min_invest_amount: 0,
      max_invest_amount: 900,
      acceptedFieldIndividualCrypto: {
        taxNumber: false,
        taxOffice: false,
        descriptionOfFunds: true,
        photoWithMeUpload: true,
        proofOfResidenceUpload: false,
      },
      acceptedFieldIndividualFiat: {
        taxNumber: false,
        taxOffice: false,
        descriptionOfFunds: true,
        photoWithMeUpload: true,
        proofOfResidenceUpload: false,
      },
    },
    2: {
      min_invest_amount: 1000,
      max_invest_amount: 14900,
    },
    3: {
      min_invest_amount: 15000,
      max_invest_amount: 99000,
      video_ident_value_individual: 15000,
      video_ident_value_company: 15000,
    },
    4: {
      min_invest_amount: 100000,
      max_invest_amount: 250000,
    },
    ...(settings.kyc_levels || {}),
  })

  const onChangeCheckbox = (level, nameField, name, state, setState) => (event) => {
    const newState = state
    newState[level][nameField][name] = event.target.checked
    setState({ ...newState })
  }

  const onChangeInputNumber = (level, name, state, setState) => (event) => {
    const newState = state
    newState[level][name] = +event.target.value
    setState({ ...newState })
  }

  const onUpdateBtnClick = () => {
    onUpdate({ kyc_levels: kycLevels })
  }

  const renderCheckbox = (checkbox, level, nameField, setCheckbox) => (
    <>
      { Object.keys(checkbox).map((name, key) => (
        <Grid key={key} item xs={12} md={3}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={checkbox[name]}
                disabled={!editingAllowed}
                onChange={onChangeCheckbox(
                  level,
                  nameField,
                  name,
                  kycLevels,
                  setCheckbox
                )}
                color="primary"
                value={checkbox[name]}
              />
            )}
            label={`Accept ${nameFields[name]}`}
          />
        </Grid>
      )) }
    </>
  )

  const renderInput = (nameField, value) => (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="input-item-label" key={`label-${nameFields[nameField]}`}>
        { nameFields[nameField] }
      </label>
      <div className="input-item" key={nameFields[nameField]}>
        <TextField
          className="input-bordered"
          value={kycLevels[value[0]][nameField]}
          onChange={onChangeInputNumber(
            value[0],
            nameField,
            kycLevels,
            setKycLevels,
          )}
          margin="none"
          type="number"
          error={error}
          variant="outlined"
          disabled={!editingAllowed}
          fullWidth
        />
      </div>
    </>
  )

  const renderFieldKYCLevel = (value) => (
    <>
      <Grid container spacing={2}>
        {Object.keys(value[1]).map((nameField) => (
          <>
            {(nameField === 'acceptedFieldIndividualCrypto' || nameField === 'acceptedFieldIndividualFiat')
              ? (
                <div>
                  <br />
                  <h6>{nameFields[nameField]}</h6>
                  <Grid container spacing={2}>
                    { renderCheckbox(kycLevels[value[0]][nameField], value[0], nameField, setKycLevels) }
                  </Grid>
                </div>
              )
              : (
                <Grid key={`${nameField}_${value[0]}`} item xs={12} md={3}>
                  {renderInput(nameField, value)}
                </Grid>
              )}
          </>
        ))}
      </Grid>
    </>
  )

  const renderKYCLevelsSettings = () => (
    <div>
      <h4>Levels</h4>
      <Grid container spacing={2}>
        {Object.entries(kycLevels).map((value) => (
          <>
            <Grid key={value[0]} item xs={12}>
              <h5>
Level
                {value[0]}
              </h5>
              { renderFieldKYCLevel(value) }
            </Grid>
          </>
        ))}
      </Grid>
    </div>
  )

  return (
    <>
      { renderKYCLevelsSettings() }
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

AdminSettingsKYClvl.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsKYClvl
