import React, { useState } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import classNames from 'classnames'

import '../styles/legacy/style.scss'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'
import GetAppIcon from '@material-ui/icons/GetApp'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'


import AccountStatus from '../components/AccountStatus'
import TokenBalance from '../components/TokenBalance'
import { useMe } from '../myHooks'
import { usePublicSettings } from '../myHooks/useSettings'
import { getFileUrl } from '../utils'
import KycLevelBox from '../components/KycLevelBox'
import AlertUpdateKyc from '../components/AlertUpdateKyc'

import { CUSTOMER_STATUS_TYPES, CUSTOMER_TYPES } from '../constants/customer'

const useStyles = makeStyles(() => ({
  pageContainer: {
    margin: '0 0 30px 0',
  },
  tokenBalance: {
    display: 'flex',
    alignItems: 'center',
  },
  tokenCard: {
    minHeight: '200px',
    height: '100%',
    margin: '0',
  },
  tokenCardInnr: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardSubtitle: {
    margin: '0 0 4px 0',
    color: '#74fffa',
  },
  callToAction: {
    padding: '25px 30px',
    '& h4': {
      margin: 0,
    },
  },
  welcomeImgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImg: {
    height: '100%',
    maxHeight: '200px',
  },
  downloadLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '230px',
  },
  sampleCard: {
    minHeight: '200px',
    height: '100%',
    padding: '25px 30px',
  },
}))


const Dashboard = () => {
  const classes = useStyles()
  const { data: { me: userData } } = useMe()
  const { data: { publicSettings } = {} } = usePublicSettings()
  const { company = {} } = publicSettings || {}

  const [values, setValues] = useState({
    ethAddressDialogOpened: false,
  })

  const changeEthAddressDialogState = (state) => () => setValues({
    ...values,
    ethAddressDialogOpened: state,
  })


  const renderAccountStatusCard = () => (
    <AccountStatus
      userData={userData}
      onOpenDialog={changeEthAddressDialogState(true)}
      onCloseDialog={changeEthAddressDialogState(false)}
      dialogOpen={values.ethAddressDialogOpened}
    />
  )

  const callActionToCard = () => (
    <Paper className={classes.callToAction} elevation={0}>
      <Grid container spacing={2}>
        <Hidden smDown>
          <Grid item md={4} className={classes.welcomeImgWrapper}>
            <img src={getFileUrl((publicSettings || {}).dataroom_logo_path)} alt="welcome" className={classes.welcomeImg} />
          </Grid>
        </Hidden>
        <Grid item md={8} sm={12}>
          <h4>
Thank you for your interest in our {' '}
            {(company || {}).name}
            {' '}
offering!
          </h4>
          <p>Please click below to access virtual dataroom. It holds all project related documents to provide you with important details.</p>

          <a href="/data-center" target="_blank" className={classNames('btn btn-primary', classes.downloadLink)}>
            <GetAppIcon />
            {' '}
            Go to Dataroom
          </a>
        </Grid>
      </Grid>
    </Paper>
  )

  const showAlertUpdateKyc = () => {
    return (userData.customer || {}).status === CUSTOMER_STATUS_TYPES.REOPEN
      || (userData.customerCompany || {}).status === CUSTOMER_STATUS_TYPES.REOPEN
  }

  const getCustomerName = () => {
    return userData.customer !== null ? 'individual' : 'customerCompany'
  }

  const getCustomerId = () => {
    return userData.customer !== null ? userData.customer.id : userData.customerCompany.id
  }

  return (
    <div className={classes.root}>
      <AppBar />
      {showAlertUpdateKyc() && (
        <AlertUpdateKyc
          kycId={getCustomerId()}
          typeKyc={getCustomerName()}
          customerTypeKyc={getCustomerName() === 'individual' ? CUSTOMER_TYPES.INDIVIDUAL : CUSTOMER_TYPES.COMPANY }
        />
      )}

      <div className={classNames('page-content', classes.pageContainer)}>
        <div className="container">
          <Grid container spacing={4}>
            <Grid item lg={4} sm={6} xs={12}>
              <TokenBalance />
            </Grid>
            <Grid item lg={4} sm={6} xs={12}>
              { renderAccountStatusCard() }
            </Grid>
            <Grid item md={4} className="main-content aside sidebar-right">
              <KycLevelBox />
            </Grid>
            <Grid item lg={8} sm={8} xs={12}>
              { callActionToCard() }
            </Grid>
          </Grid>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
