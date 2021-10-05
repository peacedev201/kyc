import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import '../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import Drawer from '@material-ui/core/Drawer'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined'
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined'
import ReorderOutlinedIcon from '@material-ui/icons/ReorderOutlined'
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined'
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import StorageIcon from '@material-ui/icons/Storage'
import Box from '@material-ui/core/Box'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

import { useCookies } from 'react-cookie'
import { logout, getFileUrl } from '../utils'
import { useMe } from '../myHooks'
import { USER_RIGHT_TYPES } from '../constants/user'
import { usePublicSettings } from '../myHooks/useSettings'
import { useQuery } from '@apollo/react-hooks';
import { tokenToEth } from '../utils/rate'
import { ME_INVEST_IN_BASE_CURRENCY } from '../queriesAndMutations';
import { useExchangeRates } from '../myHooks';

const useStyles = makeStyles(() => ({
  logoAndUser: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kycLink: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',

    '& span': {
      color: '#000',
      opacity: '.5',
      '&:hover': {
        color: 'inherit',
        opacity: '1',
      },
    },
    '& svg': {
      height: '50%',
      margin: '0 5px 0 0',
    },
  },
}))

const SETS = {
  main: [
    { title: 'Dashboard', url: '/', icon: <DashboardOutlinedIcon /> },
    { title: 'Buy Tokens', url: '/contribute', icon: <AccountBalanceWalletOutlinedIcon /> },
    { title: 'Transactions', url: '/transactions', icon: <SyncAltIcon /> },
    { title: 'Profile', url: '/profile', icon: <PersonOutlineIcon /> },
    { title: 'Data Center', url: '/data-center', icon: <StorageIcon /> },
    {
      title: 'Admin Panel', url: '/admin', rights: [USER_RIGHT_TYPES.ADMIN, USER_RIGHT_TYPES.GENERAL_ADMIN, USER_RIGHT_TYPES.COMPLIANCE_OFFICER], icon: <SupervisorAccountOutlinedIcon />,
    },
  ],
  admin: [
    { title: 'Dashboard', url: '/admin', icon: <DashboardOutlinedIcon /> },
    { title: 'User list', url: '/admin/users', icon: <ReorderOutlinedIcon /> },
    { title: 'KYC List individual', url: '/admin/kyc-list/individual', icon: <FaceOutlinedIcon /> },
    { title: 'KYC List company', url: '/admin/kyc-list/company', icon: <WorkOutlineOutlinedIcon /> },
    { title: 'Transactions', url: '/admin/transactions', icon: <SyncAltIcon /> },
    { title: 'Settings', url: '/admin/settings', icon: <SettingsOutlinedIcon /> },
    { title: 'Exchange rates', url: '/admin/exchange-rates', icon: <TrendingUpIcon /> },
  ],

  compliance_officer: [
    { title: 'User list', url: '/admin/users', icon: <ReorderOutlinedIcon /> },
    { title: 'KYC List individual', url: '/admin/kyc-list/individual', icon: <FaceOutlinedIcon /> },
    { title: 'KYC List company', url: '/admin/kyc-list/company', icon: <WorkOutlineOutlinedIcon /> },
    { title: 'Transactions', url: '/admin/transactions', icon: <SyncAltIcon /> },
  ],

  user: [
    { title: 'My profile', url: '/profile', icon: <PersonOutlineIcon /> },
    { title: 'Transactions', url: '/transactions', icon: <SyncAltIcon /> },
  ],
}


const AppBar = ({
  // from HOCs
  location,
}) => {
  const classes = useStyles()
  const [values, setValues] = useState({
    isMenuActive: false,
  })

  const { data: { me: userData } = {} } = useMe()
  const [, setCookie] = useCookies(['jwt'])
  const { data: { publicSettings } = {} } = usePublicSettings()
  const onUserLogoClick = () => {
    setValues({ ...values, isMenuActive: !values.isMenuActive })
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mobileMenuSetter = (state) => () => setMobileMenuOpen(state)

  const onUserLogoAwayClick = () => {
    setValues({ ...values, isMenuActive: false })
  }

  const {
    data: { meInvestInBaseCurrency = {} } = {},
    loading: loadingMeInvestInBaseCurrency,
  } = useQuery(ME_INVEST_IN_BASE_CURRENCY);
  const {
    data: { exchangeRates } = {},
    loading: loadingExchangeRates,
  } = useExchangeRates();
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

  const additionalBar = [
    {
      url: '/application',
      value: (
        <NavLink to="/application" className={classes.kycLink}>
          <InsertDriveFileOutlinedIcon />
          <span>KYC Application</span>
        </NavLink>),
    },
  ]

  const renderAdditionalBar = () => (
    <ul className="navbar-btns">
      {
        // eslint-disable-next-line react/no-array-index-key
        additionalBar.map((item, i) => <li key={i}>{item.value}</li>)
      }
    </ul>
  )

  const renderMainMenu = () => (
    <div className="navbar-innr">
      <ul className="navbar-menu">
        {
          SETS.main.map((item) => {
            const isActive = item.url === '/'
              ? location.pathname === '/'
              : location.pathname.indexOf(item.url) === 0

            if (!item.rights || (item.rights && (item.rights === userData.rights || item.rights.includes(userData.rights)))) {
              return (
                <li key={item.title} className={isActive ? 'active' : ''}>
                  <NavLink to={item.url}>
                    { item.icon }
                    {' '}
                    { item.title }
                  </NavLink>
                </li>
              )
            }

            return false
          })
      }
      </ul>
      { renderAdditionalBar() }
    </div>
  )

  const renderAdminMenu = () => (
    <div className="navbar-innr">
      <ul className="navbar-menu">
        {
        location.pathname.indexOf('/admin') === 0
        && SETS.admin.map((item) => {
          const isActive = item.url === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.indexOf(item.url) === 0

          return (
            <li key={item.title} className={isActive ? 'active' : ''}>
              <NavLink to={item.url}>
                { item.icon }
                {' '}
                { item.title }
              </NavLink>
            </li>
          )
        })
      }
      </ul>
    </div>
  )

  const renderComplianceOfficerMenu = () => (
    <div className="navbar-innr">
      <ul className="navbar-menu">
        {
          location.pathname.indexOf('/admin') === 0
          && SETS.compliance_officer.map((item) => {
            const isActive = item.url === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.indexOf(item.url) === 0

            return (
              <li key={item.title} className={isActive ? 'active' : ''}>
                <NavLink to={item.url}>
                  { item.icon }
                  {' '}
                  { item.title }
                </NavLink>
              </li>
            )
          })
        }
      </ul>
    </div>
  )

  const renderDropDownUserMenu = () => (
    <ul className="user-links">
      {
        SETS.user.map((item) => (
          <li key={item.title}>
            <NavLink to={item.url}>
              {item.icon}
              {item.title}
            </NavLink>
          </li>
        ))
      }
    </ul>
  )


  const maybeRenderNavigation = (isMobile = false) => (userData) && (
    <div className={isMobile ? 'navbar-mobile' : 'navbar'}>
      <div className="container">
        { location.pathname.indexOf('/admin') !== 0 && renderMainMenu() }
        { [USER_RIGHT_TYPES.ADMIN, USER_RIGHT_TYPES.GENERAL_ADMIN].includes(userData.rights) && renderAdminMenu() }
        { [USER_RIGHT_TYPES.COMPLIANCE_OFFICER].includes(userData.rights) && renderComplianceOfficerMenu() }
      </div>
    </div>
  )

  return (
    <>
      <Drawer anchor="left" open={mobileMenuOpen} onClose={mobileMenuSetter(false)}>
        {maybeRenderNavigation(true)}
      </Drawer>
      <div className="topbar-wrap">
        <div className="topbar is-sticky">
          <div className="container">

            <div className={classes.logoAndUser}>
              <Box display={{ md: 'none !important', xs: 'block' }} onClick={mobileMenuSetter(true)}>
                <div className="toggle-icon">
                  <span className="toggle-line" />
                  <span className="toggle-line" />
                  <span className="toggle-line" />
                  <span className="toggle-line" />
                </div>
              </Box>

              <NavLink to="/" className="topbar-logo">
                {(publicSettings || {}).logo_for_dark_bg_path
                  ? (<img src={getFileUrl((publicSettings || {}).logo_for_dark_bg_path)} alt="logo" />)
                  : (<img src={getFileUrl((publicSettings || {}).logo_path)} alt="logo" />)}
              </NavLink>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
              {
                (userData) && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                  <ClickAwayListener onClickAway={onUserLogoAwayClick}>
                    <ul onClick={onUserLogoClick} className="topbar-nav">
                      <li className="topbar-nav-item relative">
                        <Box display={{ xs: 'none', md: 'block' }}>
                          <span className="user-welcome d-none d-lg-inline-block">
                          Welcome
                            {' '}
                            { userData.first_name }
                            {' '}
                            {' '}
                            {' '}
                            { userData.last_name }
                          </span>
                        </Box>
                        <NavLink className="toggle-tigger user-thumb" to="#"><em className="ti ti-user" /></NavLink>
                        <div
                          className={`toggle-class dropdown-content dropdown-content-right dropdown-arrow-right user-dropdown ${values.isMenuActive ? 'active' : ''} `}
                        >
                          <div className="user-status">
                            <h6 className="user-status-title">Token balance</h6>
                            <div className="user-status-balance">
                              { tokenBalanceMock.value }
                              {' '}
                              {' '}
                              <small>{publicSettings && publicSettings.token_symbol}</small>
                            </div>
                          </div>
                          { renderDropDownUserMenu() }

                          <ul className="user-links bg-light">
                            <li>
                              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events */}
                              <a onClick={() => {
                                setCookie('jwt', '', { path: '/' })
                                logout()()
                              }}
                              >
                                <ExitToAppIcon />
                            Logout
                              </a>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </ClickAwayListener>
                )
              }
            </div>
          </div>
        </div>
        {maybeRenderNavigation()}
      </div>
    </>
  )
}

AppBar.propTypes = {
  // from HOCs
  location: PropTypes.object,
}

export default compose(withRouter)(AppBar)
