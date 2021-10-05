import React from 'react'

import classNames from 'classnames'

import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import { usePublicSettings } from '../myHooks/useSettings'

import { getExternalFileUrl } from '../utils'


const useStyles = makeStyles(() => ({
  card: {
    '&>p': {
      fontSize: '15px',
      opacity: 0.8,
    },
  },
  header: {
    textAlign: 'center',
    '&>p': {
      fontSize: '18px',
      opacity: 0.8,
    },
  },
}))

const RightOfWithdrawals = () => {
  const classes = useStyles()
  const { data: { publicSettings = {} } = {} } = usePublicSettings()
  const { company = {} } = publicSettings


  return (
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container">
          <Grid container className="row justify-content-center">
            <Grid item lg={8} xl={7} className={classes.header}>
              <h2 className="page-title">Right of Withdrawals</h2>
            </Grid>
          </Grid>
          <div className="gaps-5x" />
          <div className="card content-area">
            <div className={classNames('card-innr', classes.card)}>
              <p>
                You can withdraw from this contract declaration within 14 days without giving a reason by
                means of a clear statement. The period begins on receipt of this instruction on a durable medium,
                but not before the conclusion of the contract and also not before fulfilment of our information
                obligations pursuant to Art. 5 DMFSA. In order to safeguard the withdrawal period, the timely dispatch
                of the withdrawal declaration is sufficient if the declaration is made on a durable medium
                (e.g. letter, fax, email). The withdrawal is to be addressed to:
              </p>
              <p>
                {(company || {}).name}
                {' '}
                <br />
                {(company || {}).address}
                {' '}
                <br />
                {(company || {}).email}
                {' '}
                <br />
              </p>
              <p>
                Please refer to to the
                {' '}
                {publicSettings.rights_of_withdrawal_path
                  ? (<a href={getExternalFileUrl(publicSettings.rights_of_withdrawal_path)} rel="noopener noreferrer" target="_blank">Sample Withdrawal Form</a>)
                  : ('Sample Withdrawal Form')}
                {' '}
                that can be used for the declaration of withdrawal.
              </p>
              <div className="card-head">
                <h4 className="card-title card-title-lg">Withdrawal Consequences</h4>
              </div>
              <p>
                In the case of an effective withdrawal, the mutually received benefits must be returned.
                You are obliged to pay compensation for the service provided until the cancellation, if
                you were informed of this legal consequence prior to the submission of your contract
                declaration and if you expressly agreed that we will commence execution of the
                counter-performance before the end of the withdrawal period. If there is an obligation to pay
                compensation, this may mean that you still have to fulfil the contractual payment obligations
                for the period up to the withdrawal. Your right of withdrawal expires prematurely if the contract
                is completely fulfilled by both parties on your express wish, before you have exercised your right
                of withdrawal. Obligations to reimburse payments must be fulfilled within 30 days. The period begins
                for you with the sending of your resignation, for us with their receipt.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RightOfWithdrawals
