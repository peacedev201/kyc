import React, { useState } from 'react'

import '../styles/legacy/style.scss'
import Grid from '@material-ui/core/Grid'
import { useMutation } from '@apollo/react-hooks/lib/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { PUSH_EXCHANGE_RATES } from '../queriesAndMutations'
import Input from './Input'
import { toaster } from '../utils/toaster'
import { useMe } from '../myHooks'


const AdminExchangeRatesForm = ({ exchangeRates, refetch, editingAllowed }) => {
  const ratesNames = ['token_to_eth', 'eth_to_usd', 'eth_to_eur', 'eth_to_chf']
  const { data: { me = {} } = {} } = useMe()
  const [pushRates, { error, loading }] = useMutation(PUSH_EXCHANGE_RATES)
  const [twoFaDialogOpened, setTwoFaDialogOpened] = useState(false)
  const changeTwoFADialogState = (state) => () => setTwoFaDialogOpened(state)

  const onUpdate = () => {
    if (me.is_2fa_enabled === false) {
      return toaster.error('Please, enable 2fa first')
    }
    setTwoFaDialogOpened(true)
  }

  const onSend = async () => {
    await pushRates({ variables: { input: values } })
    setTwoFaDialogOpened(false)
    setValues({
      ...values,
      two_fa_token: '',
    })
    refetch()
  }


  const [values, setValues] = useState({
    ...(ratesNames.reduce((accumulator, value) => ({
      ...accumulator,
      [value]: String((exchangeRates || {})[value] || 0),
    }), {
      two_fa_token: '',
    })),
  })


  return (
    <>
      <Dialog open={twoFaDialogOpened} onClose={changeTwoFADialogState(false)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
            >
              <Input
                propertyName="two_fa_token"
                label="2FA token"
                state={values}
                setState={setValues}
                error={error}
                loading={loading}
              />
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Button variant="contained" color="primary" onClick={onSend}>
                Update
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid container spacing={2}>
        {ratesNames.map((rateName) => (
          <Grid item xs={12} key={rateName} md={4}>
            <Input
              propertyName={rateName}
              type="number"
              label={rateName}
              state={values}
              setState={setValues}
              error={error}
              disabled={!editingAllowed}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
      {
        loading
          ? <div><CircularProgress /></div>
          : (
            <Button disabled={!editingAllowed} variant="contained" color="primary" onClick={onUpdate}>
              Update
            </Button>
          )
      }
    </>
  )
}

export default AdminExchangeRatesForm
