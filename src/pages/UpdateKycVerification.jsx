import React, { useState } from 'react'

import '../styles/legacy/style.scss'

import makeStyles from '@material-ui/core/styles/makeStyles'

import CircularProgress from '@material-ui/core/CircularProgress'

import { useMutation, useQuery } from '@apollo/react-hooks'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import UpdateKycVerificationForm from '../components/UpdateKycVerificationForm'

import {
  MAIN_INFO_SCHEMAS,
  ADDRESS_INFO_SCHEMAS,
  INDIVIDUAL_FILES_SCHEMAS,
  INDIVIDUAL_DOCUMENT_TYPE_ENUM,
  MAIN_INFO_COMPANY_SCHEMAS,
  COMPANY_FILES_SCHEMAS,
  COMPANY_DOCUMENT_TYPE_ENUM,
} from '../schemas/kycVerification'

import {
  UPDATE_COMPANY_CUSTOMER, UPDATE_INDIVIDUAL_CUSTOMER, CUSTOMER_INDIVIDUAL, CUSTOMER_COMPANY,
} from '../queriesAndMutations'


const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
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


const UpdateKycVerification = ({ match }) => {
  const classes = useStyles()
  const { loading, data, error } = useQuery(match.params.customerName === 'individual'
    ? CUSTOMER_INDIVIDUAL
    : CUSTOMER_COMPANY, {
    variables: {
      id: match.params.customerId,
    },
    fetchPolicy: 'network-only',
  })
  const customer = (match.params.customerName === 'individual' && !loading) ? (data || {}).customerIndividual : (data || {}).customerCompany
  const [updateIndividualCustomer, updateIndividualCustomerData] = useMutation(UPDATE_INDIVIDUAL_CUSTOMER)
  const [updateCompanyCustomer, updateCompanyCustomerData] = useMutation(UPDATE_COMPANY_CUSTOMER)

  const [values, setValues] = useState({
    open: false,
    tab: match.params.customerName === 'individual' ? 'INDIVIDUAL' : 'COMPANY',
    success: false,
  })

  const onSuccess = (data, kycType) => {
    setValues({ ...values, success: true })
  }

  const renderKycVerifyForm = () => (
    <>
      {
        values.tab === 'INDIVIDUAL'
        && (
          <UpdateKycVerificationForm
            mainInfoSchemas={MAIN_INFO_SCHEMAS}
            addressInfoSchemas={ADDRESS_INFO_SCHEMAS}
            filesSchemas={INDIVIDUAL_FILES_SCHEMAS}
            documentTypeEnum={INDIVIDUAL_DOCUMENT_TYPE_ENUM}
            kycType="INDIVIDUAL"
            customer={customer}
            updateCustomer={updateIndividualCustomer}
            updateCustomerData={updateIndividualCustomerData}
            onSuccess={onSuccess}
          />
        )
      }
      {
        values.tab === 'COMPANY'
        && (
          <UpdateKycVerificationForm
            mainInfoSchemas={MAIN_INFO_COMPANY_SCHEMAS}
            filesSchemas={COMPANY_FILES_SCHEMAS}
            documentTypeEnum={COMPANY_DOCUMENT_TYPE_ENUM}
            kycType="COMPANY"
            customer={customer}
            updateCustomer={updateCompanyCustomer}
            updateCustomerData={updateCompanyCustomerData}
            onSuccess={onSuccess}
          />
        )
      }
    </>
  )

  return (
    <div className="page-user">
      <AppBar />
      {error
        ? <div className={classes.circularProgressWrapper}>Some error</div>
        : (
          <>
            { !loading ? renderKycVerifyForm() : <div className={classes.circularProgressWrapper}><CircularProgress /></div> }
          </>
        )}
      <Footer />
    </div>
  )
}

export default UpdateKycVerification
