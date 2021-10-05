import React from "react";
import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import { useQuery } from '@apollo/react-hooks'
import { usePublicSettings } from '../myHooks/useSettings'
import { useExchangeRates } from '../myHooks'
import { getFileUrl } from '../utils'
import { tokenToEth } from '../utils/rate'
import { ME_INVEST_IN_BASE_CURRENCY } from '../queriesAndMutations'
import Grid from "@material-ui/core/Grid";
// import CreateNewAndTopUpLink from "./WalletEngine/CreateNewAndTopUpLink";

const useStyles = makeStyles(() => ({
  tokenBalance: {
    display: "flex",
    alignItems: "center",
  },
  tokenCard: {
    minHeight: "200px",
    height: "100%",
    margin: "0",
  },
  tokenCardInnr: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardSubtitle: {
    margin: "0 0 4px 0",
    color: "#74fffa",
  },
  tokenBalanceText: {
    display: "inline-block",
  },
  topUpWallet: {
    color: "#fff",
    margin: 0,
    cursor: "pointer",
  },
}));


const TokenBalance = () => {
  const classes = useStyles()
  const { data: { publicSettings } = {} } = usePublicSettings()
  const {
    data: { meInvestInBaseCurrency = {} } = {},
    loading: loadingMeInvestInBaseCurrency,
  } = useQuery(ME_INVEST_IN_BASE_CURRENCY)
  const { data: { exchangeRates } = {}, loading: loadingExchangeRates } = useExchangeRates()
  const tokenBalanceMock = {
    value: !loadingMeInvestInBaseCurrency ? meInvestInBaseCurrency.approved_invest : '0',
    currency: 'TWZ',
    contribution: [
      {
        value: !loadingExchangeRates && !loadingMeInvestInBaseCurrency
          ? tokenToEth(meInvestInBaseCurrency.approved_invest, exchangeRates)
          : '~',
        currency: 'ETH',
      },
    ],
  }

  return (
    <>
      <div className={classNames('token-statistics card card-token height-auto', classes.tokenCard)}>
        <div className={classNames('card-innr', classes.tokenCardInnr)}>
          <div className={classNames('token-balance token-balance-with-icon', classes.tokenBalance)}>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={6}>
                <div className="token-balance-icon">
                  <img src={publicSettings && getFileUrl(publicSettings.brief_logo_path)} alt="logo" />
                </div>
                <div className={classes.tokenBalanceText}>
                  <h6 className={classes.cardSubtitle}>Token Balance</h6>
                  <span className="lead">
                    { tokenBalanceMock.value }
                    {' '}
                    <span>{publicSettings && publicSettings.token_symbol}</span>
                  </span>
                </div>
              </Grid>
              {/* <Grid item lg={6} sm={6} xs={6}>
                <CreateNewAndTopUpLink />
              </Grid> */}
            </Grid>
          </div>
          <div className="token-balance token-balance-s2">
            <h6 className="card-sub-title">Your Contribution</h6>
            <ul className="token-balance-list">
              {
              tokenBalanceMock.contribution.map((v) => (
                <li key={v.currency} className="token-balance-sub">
                  <span className="lead">{ v.value }</span>
                  <span className="sub">{ v.currency }</span>
                </li>
              ))
            }
            </ul>
          </div>
        </div>
      </div>

    </>
  )
}
export default TokenBalance
