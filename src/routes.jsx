import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import RegisterConfirm from './pages/RegisterConfirm'
import PasswordRestore from './pages/PasswordRestore'
import PasswordRestoreConfirm from './pages/PasswordRestoreConfirm'
import Terms from './pages/Terms'
import Policy from './pages/Policy'
import DeclarationOfConsent from './pages/DeclarationOfConsent'
import RightOfWithdrawals from './pages/RightOfWithdrawals'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import KycVerification from './pages/KycVerification'
import UpdateKycVerification from './pages/UpdateKycVerification'
import Profile from './pages/Profile'
import Contribute from './pages/Contribute'
import Transaction from './pages/Transaction'
import Transactions from './pages/Transactions'
import DataCenter from './pages/DataCenter'
import KycStatusCustomer from './pages/KycStatusCustomer'


import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'

import Theme from './components/Theme'
import ProtectedZone from './components/ProtectedZone'
import AuthRoute from './components/AuthRoute'
import AdminIndividualKyc from './pages/AdminIndividualKyc'
import AdminCompanyKyc from './pages/AdminCompanyKyc'
import AdminTransactions from './pages/AdminTransactions'
import AdminTransaction from './pages/AdminTransaction'
import AdminSettings from './pages/AdminSettings'
import AdminExchangeRates from './pages/AdminExchangeRates'
import FirstLogin from './pages/FirstLogin'
import AuthToken from './pages/AuthToken'
import SalesAuthTokenLogin from './pages/SalesAuthTokenLogin';

import VideoIDAttendedPage from "./pages/VideoIDAttendedPage";
import VideoRecoredPage from "./pages/VideoRecoredPage";

import VoltSuccessPage from "./pages/VoltSuccessPage";
import VoltFailurePage from "./pages/VoltFailurePage";
import VoltPendingPage from "./pages/VoltPendingPage";

import { USER_RIGHT_TYPES } from './constants/user'


export default (apolloClient) => (
  <Theme>
    <Switch>
      <Route exact path="/terms" component={Terms} />
      <Route exact path="/privacy-policy" component={Policy} />
      <Route exact path="/declaration-of-consent" component={DeclarationOfConsent} />
      <Route exact path="/right-of-withdrawal" component={RightOfWithdrawals} />


      <AuthRoute exact path="/login" component={Login} />
      <AuthRoute exact path="/register" component={Register} />
      <AuthRoute exact path="/register-success/:userId" component={RegisterSuccess} />
      <AuthRoute exact path="/register/confirm" component={RegisterConfirm} />
      <AuthRoute exact path="/salesLogin" component={FirstLogin} />
      <AuthRoute exact path="/salesAuthTokenLogin" component={SalesAuthTokenLogin} />
      <AuthRoute exact path="/password/restore" component={PasswordRestore} />
      <AuthRoute exact path="/password/restore/confirm" component={PasswordRestoreConfirm} />
      <Route exact path="/auth" component={AuthToken} />


      <ProtectedZone minRights={USER_RIGHT_TYPES.COMMON}>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/application" component={KycVerification} />
        <Route exact path="/application-success/:customerName/:customerId" component={KycStatusCustomer} />
        <Route exact path="/application-lvl-increase/:customerName/:customerId" component={KycStatusCustomer} />
        <Route exact path="/application-update/:customerName/:customerId" component={UpdateKycVerification} />

        <Route exact path="/transactions" component={Transactions} />
        <Route exact path="/transactions/:transactionId" component={Transaction} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/contribute" component={Contribute} />
        <Route exact path="/data-center" component={DataCenter} />
        <Route exact path="/video-id-attended" component={VideoIDAttendedPage} />
        <Route exact path="/video-id-recored/:videoId" component={VideoRecoredPage} />

        <Route exact path="/volt-success" component={VoltSuccessPage} />
        <Route exact path="/volt-failure" component={VoltFailurePage} />
        <Route exact path="/volt-pending" component={VoltPendingPage} />

        <ProtectedZone minRights={USER_RIGHT_TYPES.COMPLIANCE_OFFICER} urlToRedirect="/">
          <Route exact path="/admin" component={AdminPanel} />
          <Route exact path="/admin/settings" component={AdminSettings} />
          <Route exact path="/admin/users" component={AdminUsers} />
          <Route exact path="/admin/transactions" component={AdminTransactions} />
          <Route exact path="/admin/exchange-rates" component={AdminExchangeRates} />
          <Route exact path="/admin/transactions/:transactionId" component={AdminTransaction} />
          <Route exact path="/admin/kyc-list/individual" component={AdminIndividualKyc} />
          <Route exact path="/admin/kyc-list/company" component={AdminCompanyKyc} />
        </ProtectedZone>


        <ProtectedZone minRights={USER_RIGHT_TYPES.ADMIN} urlToRedirect="/">
          <Route exact path="/admin/kyc-list/individual" component={AdminIndividualKyc} />
          <Route exact path="/admin/kyc-list/company" component={AdminCompanyKyc} />
        </ProtectedZone>

        <Route exact path="*" component={NotFound} />
      </ProtectedZone>


    </Switch>
  </Theme>
)
