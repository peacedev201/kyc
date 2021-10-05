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
  eth_address: {
    label: 'Eth address',
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const AdminSettingsCrypto = ({
  cryptoSettings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const [values, setValues] = useState({
    ...reduce(SETS, (memo, value, key) => {
      // eslint-disable-next-line no-param-reassign
      memo[key] = (cryptoSettings && cryptoSettings[key]) || ''
      return memo
    }, {}),
  })

  const onUpdateBtnClick = () => {
    onUpdate({ crypto: values })
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
              error={error}
              disabled={!editingAllowed}
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

AdminSettingsCrypto.propTypes = {
  cryptoSettings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsCrypto
