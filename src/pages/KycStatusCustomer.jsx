import React from 'react'

import classNames from 'classnames'

import '../styles/legacy/style.scss'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { useQuery } from '@apollo/react-hooks'


import CircularProgress from '@material-ui/core/CircularProgress'

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Button from '@material-ui/core/Button'
import { NavLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { CUSTOMER_INDIVIDUAL, CUSTOMER_COMPANY, KYC_LVL_USER } from '../queriesAndMutations'
import { CUSTOMER_STATUS_TYPES, CUSTOMER_TYPES } from '../constants/customer'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'

import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'react-share';

import { usePublicSettings } from '../myHooks/useSettings';
import { useExchangeRates } from '../myHooks';
import { ethToFiat, tokenToEth } from '../utils/rate';

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: '70px',
  },
  kycLvl: {
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successSend: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIcon: {
    color: '#009f65',
  },
  pendingIcon: {
    color: '#ffc100',
  },
  errorIcon: {
    color: '#f00',
  },
  idleIcon: {
    color: '#000',
    opacity: 0.6,
  },
  largeSizeIcon: {
    fontSize: '15rem',
  },
  iconCenter: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonBack: {
    marginTop: '30px',
  },
  link: {
    color: '#fff',
    '&:hover': {
      color: '#fff',
    },
  },
  shareDiv: {
    margin: '10px',
  },
  shareButton: {
    marginRight: '10px',
  }
}));

const KycStatusCustomer = ({ match }) => {
  const classes = useStyles()
  const { loading, error, data } = useQuery(match.params.customerName === 'individual'
    ? CUSTOMER_INDIVIDUAL
    : CUSTOMER_COMPANY, {
    variables: {
      id: match.params.customerId,
    },
    fetchPolicy: 'network-only',
  })
  const customer = (match.params.customerName === 'individual' && !loading)
    ? (data || {}).customerIndividual
    : (data || {}).customerCompany
  const { data: { kycLvlUser = {} } = {}, loading: loadingCurrentKycLvl } = useQuery(KYC_LVL_USER, {
    variables: {
      input: {
        customerId: +match.params.customerId,
        customerType: match.params.customerName === 'individual'
          ? CUSTOMER_TYPES.INDIVIDUAL
          : CUSTOMER_TYPES.COMPANY,
      },
    },
  })

  const { data: { exchangeRates } = {} } = useExchangeRates();
  const { data: { publicSettings = {} } = {} } = usePublicSettings();
  const { token_name, first_link_login, login_youtube_video } = publicSettings;
  const amount = (customer || {}).amount;
  const currency = (customer || {}).currency;

  let shareTitle;
  let shareAmount;

  if (amount !== undefined && exchangeRates !== undefined && currency !== undefined) {
    shareAmount = ethToFiat(
      currency,
      tokenToEth(amount, exchangeRates),
      exchangeRates
    );
    shareTitle = `I just invested ${shareAmount} ${(currency || '').toUpperCase()} in ${token_name}. Get yours at ${first_link_login}`;
  }

  const RenderSocialShare = () => (
    <div className={classes.shareDiv}>
      <FacebookShareButton
        url={login_youtube_video}
        quote={shareTitle}
        className={classes.shareButton}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <LinkedinShareButton
        url={login_youtube_video}
        title={shareTitle}
        className={classes.shareButton}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );

  const RenderKycStatus = () => (
    <>
      {error && (
        <div className={classes.iconCenter}>
          <ErrorOutlineIcon className={classNames(classes.errorIcon, classes.largeSizeIcon)} />
          <h4 className="card-title card-title-lg">Wrong permissions!</h4>
        </div>
      )}
      {!error && (
        <div className={classes.successSend}>
          {(customer.status === CUSTOMER_STATUS_TYPES.PENDING || customer.status === CUSTOMER_STATUS_TYPES.KYC_LVL_CHANGE) && (
            <>
              <div className={classes.iconCenter}>
                <AccessTimeIcon className={classNames(classes.pendingIcon, classes.largeSizeIcon)} />
                <h4 className="card-title card-title-lg">Your KYC application is pending</h4>
              </div>
              { RenderSocialShare() }
            </>
          )}
          {customer.status === CUSTOMER_STATUS_TYPES.APPROVED && (
            <>
              <div className={classes.iconCenter}>
                <CheckCircleOutlineIcon className={classNames(classes.successIcon, classes.largeSizeIcon)} />
                <h4 className="card-title card-title-lg">You have completed the process of KYC</h4>
              </div>
              { RenderSocialShare() }
            </>
          )}
          {customer.status === CUSTOMER_STATUS_TYPES.REJECTED && (
            <div className={classes.iconCenter}>
              <ErrorOutlineIcon className={classNames(classes.errorIcon, classes.largeSizeIcon)} />
              <h4 className="card-title card-title-lg">Your KYC application were declined</h4>
            </div>
          )}
        </div>
      )}
    </>
  )

  const RenderKycLvl = () => (
    <div className={classes.kycLvl}>
      {customer.status === CUSTOMER_STATUS_TYPES.KYC_LVL_CHANGE && (
        <Typography>
          Your KYC increase from lvl
          {' '}
          { kycLvlUser.kyc_level - 1 }
          {' '}
to lvl
          {' '}
          { kycLvlUser.kyc_level }
          {' '}
is pending
        </Typography>
      )}
    </div>
  )

  return (
    <div className="page-content">
      <AppBar />
      <div className="container">
        <div className="page-user">
          {loading || loadingCurrentKycLvl
            ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
            : (
              <div className="card content-area">
                <div className="card-innr">
                  <div className={classNames('card-text', classes.iconCenter)}>
                    <div className={classes.marginBottom}>
                      { RenderKycStatus() }
                      { RenderKycLvl() }
                    </div>
                    <Button className={classes.buttonBack} variant="contained" color="primary">
                      <NavLink className={classes.link} to="/profile">Back in profile</NavLink>
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default KycStatusCustomer
