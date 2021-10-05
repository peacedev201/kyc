import React, { useState } from 'react'

import reduce from 'lodash/reduce'
import omit from 'lodash/omit'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Input from '../Input'

const SETS = {
  host: {
    label: 'MailGun host',
    default: '',
  },
  port: {
    label: 'MailGun port',
    default: '',
  },
  user: {
    label: 'MailGun user',
    default: '',
  },
  pass: {
    label: 'MailGun password',
    type: 'password',
    default: '',
  },
  from: {
    label: 'From',
    default: '',
  },
  from_for_comment: {
    label: 'From for comment',
    default: '',
  },
  from_dublicate: {
    label: 'From dublicate',
    default: '',
  },
  from_kyc_approval_email: {
    label: 'KYC approval email',
    helperText: 'Only the email at KYC submission should be sent',
    default: '',
  },
  subject_prefix: {
    label: 'Email subject prefix',
    default: '',
  },
  secure: {
    default: false,
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const AdminSettingsMailgun = ({
  mailgunSettings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const [values, setValues] = useState({
    ...reduce(SETS, (memo, value, key) => {
      // eslint-disable-next-line no-param-reassign
      memo[key] = (mailgunSettings && mailgunSettings[key]) || SETS[key].default
      return memo
    }, {}),
  })

  const onUpdateBtnClick = () => {
    onUpdate({ mailgun: values })
  }

  const handleChangeCheckBox = (propertyName) => (event) => {
    setValues({ ...values, [propertyName]: event.target.checked })
  }

  return (
    <>
      <Grid container spacing={2}>
        {
        Object.keys(omit(SETS, 'secure')).map((item) => (
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
              setState={setValues}
              helperText={SETS[item].helperText}
              error={error}
              disabled={!editingAllowed}
              loading={loading}
            />
          </Grid>
        ))
      }
      </Grid>
      <FormControlLabel
        control={(
          <Checkbox
            checked={values.secure}
            onChange={handleChangeCheckBox('secure')}
            color="primary"
            value="secure"
            disabled={!editingAllowed}
          />
        )}
        label="Secure"
      />
      <br />
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

AdminSettingsMailgun.propTypes = {
  mailgunSettings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsMailgun
