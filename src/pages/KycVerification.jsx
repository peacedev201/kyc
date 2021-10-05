import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

import '../styles/legacy/style.scss'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'

import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

import WorkIcon from '@material-ui/icons/Work'
import FaceIcon from '@material-ui/icons/Face'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'

import { useMutation } from '@apollo/react-hooks'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import KycVerificationForm from '../components/KycVerificationForm'

import {
  MAIN_INFO_SCHEMAS,
  ADDRESS_INFO_SCHEMAS,
  INDIVIDUAL_FILES_SCHEMAS,
  INDIVIDUAL_DOCUMENT_TYPE_ENUM,
  MAIN_INFO_COMPANY_SCHEMAS,
  COMPANY_FILES_SCHEMAS,
  COMPANY_DOCUMENT_TYPE_ENUM,
} from '../schemas/kycVerification'

import { USER_KYC_STATUS_TYPES } from '../constants/user'

import { REGISTRATION_INDIVIDUAL_CUSTOMER, REGISTRATION_COMPANY_CUSTOMER } from '../queriesAndMutations'
import { useMe } from '../myHooks'

const useStyles = makeStyles(() => ({
  tabs: {
    marginBottom: '20px',
  },
  successSend: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '150px',
  },
  iconFile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      width: '70%',
      height: '70%',
      opacity: '.4',
    },
  },
}))


const KycVerification = () => {
  const classes = useStyles()

  const { data } = useMe()
  const [registerIndividualCustomer, registerIndividualCustomerData] = useMutation(REGISTRATION_INDIVIDUAL_CUSTOMER)
  const [registerCompanyCustomer, registerCompanyCustomerData] = useMutation(REGISTRATION_COMPANY_CUSTOMER)

  const [values, setValues] = useState({
    open: true,
    tab: 'INDIVIDUAL',
    success: false,
  })

  const onOpenBtnClick = () => {
    setValues({ ...values, open: false })
  }

  const onChangeTab = (e, newValue) => {
    setValues({ ...values, tab: newValue })
  }

  const onSuccess = (data, kycType) => {
    setValues({ ...values, success: true })
  }

  const renderKycVerifyForm = () => (
    <>
      <div className={classNames('container', classes.tabs)}>
        <Grid justify="center" alignItems="center" container spacing={0}>
          <Grid item xl={9} lg={10} xs={12}>
            <Paper elevation={0}>
              <Tabs
                value={values.tab}
                onChange={onChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                centered
              >
                <Tab value="INDIVIDUAL" icon={<FaceIcon />} label="Individual" />
                <Tab value="COMPANY" icon={<WorkIcon />} label="Company" />
              </Tabs>
            </Paper>
          </Grid>
        </Grid>
      </div>
      {
        values.tab === 'INDIVIDUAL'
        && (
        <KycVerificationForm
          mainInfoSchemas={MAIN_INFO_SCHEMAS}
          addressInfoSchemas={ADDRESS_INFO_SCHEMAS}
          filesSchemas={INDIVIDUAL_FILES_SCHEMAS}
          documentTypeEnum={INDIVIDUAL_DOCUMENT_TYPE_ENUM}
          kycType="INDIVIDUAL"
          registerCustomer={registerIndividualCustomer}
          registerCustomerData={registerIndividualCustomerData}
          onSuccess={onSuccess}
        />
        )
      }
      {
        values.tab === 'COMPANY'
        && (
        <KycVerificationForm
          mainInfoSchemas={MAIN_INFO_COMPANY_SCHEMAS}
          filesSchemas={COMPANY_FILES_SCHEMAS}
          documentTypeEnum={COMPANY_DOCUMENT_TYPE_ENUM}
          kycType="COMPANY"
          registerCustomer={registerCompanyCustomer}
          registerCustomerData={registerCompanyCustomerData}
          onSuccess={onSuccess}
        />
        )
      }
    </>
  )

  return (
    <div className="page-user">
      <AppBar />
      {
        (values.success || (data && data.me && data.me.kyc_status !== USER_KYC_STATUS_TYPES.NOT_SUBMITTED)) && (
          <div className={classes.successSend}>
            <h2 className="page-ath-heading">
              Thank you! Your request has been sent.
            </h2>
            <span><NavLink to="/">Go to dashboard</NavLink></span>
          </div>
        )
      }
      {
        (!values.success && !(data && data.me && data.me.kyc_status !== USER_KYC_STATUS_TYPES.NOT_SUBMITTED)) && (
          <>
            <div className="page-header page-header-kyc">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8 col-xl-7 text-center">
                    <h2 className="page-title">KYC Verification</h2>
                    <p className="large">
                      To comply with regulation each participant will have to go through indentity
                      verification (KYC/AML) to prevent fraud causes. Please, complete our fast and secure verification process
                      to participate in our token sale.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {
              values.open && (
                <div className="page-content">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-lg-10 col-xl-9">
                        <div className="kyc-status card mx-lg-4">
                          <div className="card-innr">
                            <div className="status status-empty">
                              <div className={classNames('status-icon', classes.iconFile)}>
                                <InsertDriveFileOutlinedIcon />
                              </div>
                              <span className="status-text text-dark">You have not submitted required documents to verify your identity. In order to purchase our tokens, please proceed with KYC procedure.</span>
                              <button type="button" onClick={onOpenBtnClick} className="btn btn-primary">Click here to complete your KYC</button>
                            </div>
                          </div>
                        </div>
                        <div className="gaps-1x" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            {
              !values.open && renderKycVerifyForm()
            }
          </>
        )
      }
      <Footer />
    </div>
  )
}

export default KycVerification
