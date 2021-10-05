import React from 'react'

import classNames from 'classnames'

import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import { usePublicSettings } from '../myHooks/useSettings'


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

const DeclarationOfConsent = () => {
  const classes = useStyles()
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()

  return (
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container">
          <Grid container className="row justify-content-center">
            <Grid item lg={8} xl={7} className={classes.header}>
              <h2 className="page-title">Declaration of Consent</h2>
              <p className="large">
                Data Protection and Competition Law Declaration of Consent
                in the use of data for further purposes (the “Declaration of Consent”)
              </p>
            </Grid>
          </Grid>
          <div className="gaps-5x" />
          <div className="card content-area">
            <div className={classNames('card-innr', classes.card)}>
              <p>
              I hereby consent I am aware that the submission of this Declaration of
              Consent is voluntary and has no impact on the performance of the intended purpose of the contract.
              </p>
              <p>
              If you no longer wish to receive advertising in the future, you can
              use your right to object to the use of your data for advertising purposes
              and modify or revoke the given Declaration of Consent at any time without
              stating any reasons with effect for the future. You can submit the withdrawal
              either by post, by email or by fax. You will incur no other costs than the postage
              costs or the transmission costs according to the existing base rates. The withdrawal is to be addressed to:
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DeclarationOfConsent
