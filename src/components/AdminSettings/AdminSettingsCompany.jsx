import React, { useState } from 'react'

import reduce from 'lodash/reduce'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Input from '../Input'

const SETS = {
  name: {
    label: 'Company name',
  },
  email: {
    label: 'Company email',
  },
  address: {
    label: 'Company address',
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const AdminSettingsCompany = ({
  companySettings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const [values, setValues] = useState({
    ...reduce(SETS, (memo, value, key) => {
      // eslint-disable-next-line no-param-reassign
      memo[key] = (companySettings && companySettings[key]) || ''
      return memo
    }, {}),
  })

  const onUpdateBtnClick = () => {
    onUpdate({ company: values })
  }

  return (
    <>
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
              setState={setValues}
              disabled={!editingAllowed}
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

AdminSettingsCompany.propTypes = {
  companySettings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsCompany
