import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useQuery } from "@apollo/react-hooks";

import '../styles/legacy/style.scss'
import Paper from '@material-ui/core/Paper'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle } from '@material-ui/core'
import WalletAddress from './profile/WalletAddress'
import { USER_KYC_STATUS_TYPES, USER_VIDEO_IDENT_STATUS } from '../constants/user'
import { ME_INVEST_IN_BASE_CURRENCY } from "../queriesAndMutations";
import { useSettings } from "../myHooks/useSettings";

const useStyles = makeStyles(() => ({
  editWallet: {
    color: '#1c65c9',
    margin: 0,
    cursor: 'pointer',
  },
  dialog: {
    '& .MuiDialog-paper': {
      padding: '10px 0 26px 0',
    },
  },
  paper: {
    minWidth: '200px',
  },
}))

const AccountStatus = ({
  userData, dialogOpen, onOpenDialog, onCloseDialog,
}) => {
  const classes = useStyles()
  const shortFormatEthAddress = (ethAddress) => `${ethAddress.slice(0, 8)}....${ethAddress.slice(ethAddress.length - 8, ethAddress.length)}`
  const {
    data: { meInvestInBaseCurrency = {} } = {},
    loading: loadingMeInvestInBaseCurrency,
  } = useQuery(ME_INVEST_IN_BASE_CURRENCY);
  const currentInvestLevel = !loadingMeInvestInBaseCurrency
      ? (meInvestInBaseCurrency.current_lvl || {}).level
      : 1;
  let notVideoIdentCountries = [];
  let countryOfResidence = '';

  const { data } = useSettings({ fetchPolicy: "network-only" });
  if (data && data.settings.not_video_ident_countries) {
    notVideoIdentCountries = Object.values(data.settings.not_video_ident_countries);
  }
  if (userData && userData.customer && userData.customer.countryOfResidence) {
    countryOfResidence = userData.customer.countryOfResidence;
  };

  const renderEmailVerificationStatusBox = () => {
    const buttonClass = userData.is_active ? 'btn-success' : 'btn-danger'
    const text = userData.is_active ? 'Email verified' : 'Email not verified'
    return (<li><button type="button" className={`btn btn-auto btn-xs ${buttonClass}`}>{text}</button></li>)
  }

  const renderKYCStatusBox = () => {
    const kycStatusMapping = {
      [USER_KYC_STATUS_TYPES.NOT_SUBMITTED]: {
        buttonClass: 'btn-danger',
        text: 'KYC is unfilled',
      },
      [USER_KYC_STATUS_TYPES.PENDING]: {
        buttonClass: 'btn-warning',
        text: 'KYC pending',
      },
      [USER_KYC_STATUS_TYPES.REJECTED]: {
        buttonClass: 'btn-danger',
        text: 'KYC rejected',
      },
      [USER_KYC_STATUS_TYPES.PASSED]: {
        buttonClass: 'btn-success',
        text: 'KYC passed',
      },
    }
    const { buttonClass, text } = kycStatusMapping[userData.kyc_status]
    return (
      <>
      {userData.kyc_status === USER_KYC_STATUS_TYPES.NOT_SUBMITTED ?
        (
          <li>
            <a href="/application" className={`btn btn-auto btn-xs ${buttonClass}`}>{text}</a>
          </li>
        ) :
        (
          <li><button type="button" className={`btn btn-auto btn-xs ${buttonClass}`}>{text}</button></li>
        )
      }
      </>
    )
  }

  const renderVideoIdentStatus = () => {
    if (userData.kyc_status === USER_KYC_STATUS_TYPES.NOT_SUBMITTED) {
      return null;
    }
    if (
      (notVideoIdentCountries &&
      countryOfResidence &&
      notVideoIdentCountries.includes(countryOfResidence)) &&
      (currentInvestLevel && currentInvestLevel < 2)
    ){
      return null;
    }
    const buttonClass =
      userData.video_ident_status === USER_VIDEO_IDENT_STATUS.PASSED
        ? "btn-success"
        : "btn-warning";
    const textMapping = {
      [USER_VIDEO_IDENT_STATUS.PASSED]: "Video ident passed",
      [USER_VIDEO_IDENT_STATUS.PENDING]: "Video ident pending",
      [USER_VIDEO_IDENT_STATUS.NOT_NEEDED]: "Video ident not needed",
      [USER_VIDEO_IDENT_STATUS.DENIED]: "Video ident denied",
    };
    const text = textMapping[userData.video_ident_status];
    return (
      <>
        {userData.video_ident_status === USER_VIDEO_IDENT_STATUS.PASSED ? (
          <li>
            <button
              type="button"
              className={`btn btn-auto btn-xs ${buttonClass}`}
            >
              {text}
            </button>
          </li>
        ) : userData.video_ident_status !== USER_VIDEO_IDENT_STATUS.NOT_NEEDED ? (
          <li>
            <a
              href="/video-id-attended"
              className={`btn btn-auto btn-xs ${buttonClass}`}
              target="_blank"
            >
              {text}
            </a>
          </li>
        ) : null}
      </>
    );
  };

  const renderStatusBoxes = () => (
    <ul className="btn-grp">
      {renderEmailVerificationStatusBox()}
      {renderKYCStatusBox()}
      {renderVideoIdentStatus()}
    </ul>
  )

  return (
    <>
      <Paper elevation={0} className={classNames('account-info', classes.paper)}>
        <div className="card-innr">
          <h6 className="card-title card-title-sm">Your Account Status</h6>
          {renderStatusBoxes()}
          <div className="gaps-2-5x" />
          <h6 className="card-title card-title-sm">Receiving Wallet</h6>
          {userData.eth_receiving_wallet ? (
            <Box display="flex" justifyContent="space-between">
              <span>{shortFormatEthAddress(userData.eth_receiving_wallet)}</span>
              <p onClick={onOpenDialog} className={`${classes.editWallet} link link-ucap`}>Edit</p>
            </Box>
          ) : (
            <Box display="flex" justifyContent="space-between">
              <span>Not added yet</span>
              <p onClick={onOpenDialog} className={`${classes.editWallet} link link-ucap`}>Add</p>
            </Box>
          )}
        </div>
      </Paper>

      <Dialog className={classes.dialog} open={dialogOpen} onClose={onCloseDialog}>
        <DialogTitle>
          Wallet Address
        </DialogTitle>
        <DialogContent>
          <WalletAddress />
        </DialogContent>
      </Dialog>
    </>
  )
}

AccountStatus.propTypes = {
  dialogOpen: PropTypes.bool,
  userData: PropTypes.object.isRequired,
  onOpenDialog: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
}

export default AccountStatus
