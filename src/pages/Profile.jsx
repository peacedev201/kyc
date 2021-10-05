import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/core/styles/makeStyles'


import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { useMe } from '../myHooks'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import PersonalData from '../components/profile/PersonalData'
import Password from '../components/profile/Password'
import Banking from '../components/profile/Banking'
import TwoFactorAuth from '../components/profile/TwoFactorAuth'
import DisableTwoFactorAuth from '../components/profile/DisableTwoFactorAuth'
import AccountStatus from '../components/AccountStatus'
import KycLevelBox from '../components/KycLevelBox'

import { USER_KYC_STATUS_TYPES } from '../constants/user'

const useStyles = makeStyles(() => ({
  nav: {
    display: 'flex',
    'padding-left': 0,
    'list-style': 'none',
  },
  navLink: {
    display: 'block',
    cursor: 'pointer',
  },
  editWallet: {
    color: '#1c65c9',
    margin: 0,
    cursor: 'pointer',
  },
  accountStatus: {
    margin: '0 0 25px 0',
  },
}))

const Profile = () => {
  const { data: { me: userData }, refetch: refetchMe } = useMe()
  const classes = useStyles()
  const [values, setValues] = useState({
    tab: 'PERSONAL_DATA',
    ethAddressDialogOpened: false,
    twoFADialogOpened: false,
    disableTwoFADialogOpened: false,
  })

  const changeEthAddressDialogState = (state) => () => setValues({
    ...values,
    ethAddressDialogOpened: state,
  })

  const changeTwoFADialogState = (state) => () => setValues({
    ...values,
    twoFADialogOpened: state,
  })

  const changeDisableTwoFADialogState = (state) => () => setValues({
    ...values,
    disableTwoFADialogOpened: state,
  })

  const changeTab = (tabName) => () => setValues({
    ...values,
    tab: tabName,
  })

  const renderTabs = () => (
    <ul className={`${classes.nav} nav-tabs nav-tabs-line`} role="tablist">
      <li className="nav-item">
        <p className={`${classes.navLink} nav-link ${values.tab === 'PERSONAL_DATA' ? 'active' : ''}`} onClick={changeTab('PERSONAL_DATA')}>Personal Data</p>
      </li>
      <li className="nav-item">
        <p className={`${classes.navLink} nav-link ${values.tab === 'PASSWORD' ? 'active' : ''}`} onClick={changeTab('PASSWORD')}>Password</p>
      </li>
      <li className="nav-item">
        <p className={`${classes.navLink} nav-link ${values.tab === 'BANKING' ? 'active' : ''}`} onClick={changeTab('BANKING')}>Banking</p>
      </li>
    </ul>
  )


  return (
    <>
      <Dialog open={values.twoFADialogOpened} onClose={changeTwoFADialogState(false)}>
        <DialogContent>
          <TwoFactorAuth onClose={changeTwoFADialogState(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={values.disableTwoFADialogOpened} onClose={changeDisableTwoFADialogState(false)}>
        <DialogContent>
          <DisableTwoFactorAuth onClose={changeDisableTwoFADialogState(false)} />
        </DialogContent>
      </Dialog>

      <div className="page-user">
        <AppBar />
        <div className="page-content">
          <div className="container">
            <Grid container spacing={4}>
              <Grid item md={8} className="main-content">
                <div className="content-area card">
                  <div className="card-innr">
                    <div className="card-head">
                      <h4 className="card-title">Profile Details</h4>
                    </div>
                    {renderTabs()}

                    <div className="tab-content" id="profile-details">
                      {values.tab === 'PERSONAL_DATA' && (
                      <div className="tab-pane fade show active" id="personal-data">
                        <PersonalData />
                      </div>
                      )}

                      {values.tab === 'PASSWORD' && (
                      <div className="tab-pane fade" id="password">
                        <Password />
                      </div>
                      )}

                      {values.tab === 'BANKING' && (
                        <div className="tab-pane fade" id="password">
                          <Banking userData={userData} refetch={refetchMe} />
                        </div>
                      )}

                    </div>

                  </div>

                </div>

                <div className="content-area card">
                  <div className="card-innr">
                    <div className="card-head">
                      <h4 className="card-title">Two-Factor Verification</h4>
                    </div>
                    <p>
                      Two-factor authentication is a method used for protection of your web account.
                      When it is activated you are required to enter not only your password, but also an activation code.
                      This code will be issueed to you by a mobile application. Even if anyone would find out your password
                      2FA would still protect your account from unauthorized access. Security is our top priority at all times.
                    </p>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span className="text-light ucap d-inline-flex align-items-center">
                        <span className="mb-0"><small>Current Status:</small></span>
                        {' '}
                        {' '}
                        {userData.is_2fa_enabled ? (
                          <span className="badge badge-success ml-2">Enabled</span>
                        ) : (
                          <span className="badge badge-disabled ml-2">Disabled</span>
                        )}
                      </span>
                      <div className="gaps-2x d-sm-none" />
                      {!userData.is_2fa_enabled ? (
                        <button type="button" onClick={changeTwoFADialogState(true)} className="order-sm-first btn btn-primary">Enable 2FA</button>
                      ) : (
                        <button type="button" onClick={changeDisableTwoFADialogState(true)} className="order-sm-first btn btn-danger">Disable 2FA</button>
                      )}
                    </Box>
                  </div>

                </div>

              </Grid>

              <Grid item md={4} className="main-content aside sidebar-right">
                <div className={classes.accountStatus}>
                  <AccountStatus
                    userData={userData}
                    onOpenDialog={changeEthAddressDialogState(true)}
                    onCloseDialog={changeEthAddressDialogState(false)}
                    dialogOpen={values.ethAddressDialogOpened}
                  />
                </div>

                <KycLevelBox hiddenIfLvlZero />

                {userData.kyc_status !== USER_KYC_STATUS_TYPES.PENDING && (
                  <div className="kyc-info card">
                    <div className="card-innr">
                      <h6 className="card-title card-title-sm">Identity Verification - KYC</h6>
                      <p>To comply with regulations, in order to participate in offering, investor indentity verification is required.</p>
                      <p className="lead text-light pdb-0-5x">
                        You have not submitted your KYC application to verify your indentity.
                      </p>
                      <NavLink to="/application" className="btn btn-primary btn-block">Click to Proceed</NavLink>
                      <h6 className="kyc-alert text-danger">* KYC verification required to purchase tokens</h6>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>

        </div>


        <Footer />
      </div>
    </>
  )
}

export default Profile
