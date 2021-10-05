import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import InfoIcon from '@material-ui/icons/Info'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'

import { useMutation } from '@apollo/react-hooks'
import { useMe } from '../../myHooks'
import { WALLET_ADDRESS_MUTATION } from '../../queriesAndMutations'
import Input from '../Input'
import { toaster } from '../../utils'
import { usePublicSettings } from '../../myHooks/useSettings'


const WalletAddress = () => {
  const { data: { me: userData }, refetch } = useMe()
  const { data: { publicSettings } = {} } = usePublicSettings()
  const [updateWalletAddress, { loading, error }] = useMutation(WALLET_ADDRESS_MUTATION)
  const [value, setValue] = useState({
    eth_receiving_wallet: '',
    currency: 'eth',
    ...userData,
  })


  const isDataUpToDate = () => userData.eth_receiving_wallet === value.eth_receiving_wallet

  const submit = async (e) => {
    e.preventDefault()
    await updateWalletAddress({ variables: { eth_receiving_wallet: value.eth_receiving_wallet } })
    await refetch()
    toaster.success('Wallet address was successfully saved')
  }


  return (
    <>
      <p>
        In order to receive your
        <span>
          <strong>
            {' '}
            {publicSettings && publicSettings.token_symbol}
            {' '}
            Tokens
          </strong>
        </span>
          , please select your wallet address and
        you have to put the address below input box.
        <strong>
          You will receive
          {' '}
          {publicSettings && publicSettings.token_symbol}
          {' '}
tokens to this address after the
          Token Sale end.
        </strong>
      </p>
      <form onSubmit={submit}>
        <Grid container spacing={2}>
          <Grid item xs={8} sm={4}>
            <div className=" input-with-label input-wallet-item">
              <Input
                propertyName="currency"
                label="Select Wallet"
                state={value}
                setState={setValue}
                error={error}
                loading={loading}
                select
              >
                <MenuItem key="eth" value="eth">
                  Ethereum
                </MenuItem>
              </Input>
            </div>
          </Grid>
          <Grid item xs={12} sm={9}>
            <div className=" input-with-label input-wallet-item">
              <Input
                propertyName="eth_receiving_wallet"
                label="Your address for tokens"
                state={value}
                setState={setValue}
                error={error}
                loading={loading}
              />
            </div>
          </Grid>
        </Grid>

        <div className="note note-plane note-danger">
          <p>
            <InfoIcon fontSize="inherit" />
            {' '}
            DO NOT USE your exchange wallet address such as Kraken, Bitfinex, Bithumb, Binance etc. You can use
            MetaMask, MayEtherWallet, Mist wallets etc. Do not use the address if you don’t have a private key of the
            your address. You WILL NOT receive
            {' '}
            {publicSettings && publicSettings.token_symbol}
            {' '}
Tokens and WILL LOSE YOUR FUNDS if you do.
          </p>
        </div>
        <div className="gaps-3x" />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <button type="submit" className="btn btn-primary">Update Wallet</button>
          <div className="gaps-2x d-sm-none" />
          {isDataUpToDate() && (
          <span className="text-success">
            <CheckBoxIcon fontSize="inherit" />
            {' '}
            Wallet address is up-to-date
          </span>
          )}
        </Box>
      </form>
    </>
  )
}

export default WalletAddress
