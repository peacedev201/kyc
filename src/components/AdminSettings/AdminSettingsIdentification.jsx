import React, { useState } from 'react'
import PropTypes from 'prop-types'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Input from '../Input'

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

const AdminSettingsIdentification = ({
  settings, loading, error, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const nameFields = {
    api_url: 'API url',
    api_token: 'API token',
  }

  const [identification, setIdentification] = useState({
    api_url: 'https://etrust-sandbox.electronicid.eu/dashboard/user/login',
    api_token: '376d1e54-bda8-4bb4-95c1-0903b4293132',
    ...(settings.identification || {}),
  })

  const onUpdateBtnClick = () => {
    onUpdate({ identification })
  }

  return (
    <>
      <Grid container spacing={2}>
        {
          Object.keys(identification).map((item) => (
            <Grid
              item
              xs={12}
              md={6}
              key={item}
            >
              <Input
                propertyName={item}
                label={nameFields[item]}
                state={identification}
                disabled={!editingAllowed}
                setState={setIdentification}
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

AdminSettingsIdentification.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

export default AdminSettingsIdentification
