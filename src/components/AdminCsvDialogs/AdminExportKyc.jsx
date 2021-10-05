import React, { useState } from 'react'
import propTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { ADMIN_KYC_LIST_CSV } from '../../queriesAndMutations'
import Input from '../Input'


const AdminExportKyc = ({ type, onClose, isPythagoras, isBank }) => {
  const [value, setValue] = useState({
    stepNumber: 0,
    two_fa_token: '',
  })

  const [queryUserList, { loading, error, data: { kycListCsv } = {} }] = useMutation(ADMIN_KYC_LIST_CSV)


  const changeStep = (step) => setValue({
    ...value,
    stepNumber: step,
  })

  const csvData = kycListCsv && URL.createObjectURL(new Blob([kycListCsv], {type: 'text/csv'}))

  const onSubmit = async (e) => {
    e.preventDefault()
    await queryUserList({ variables: { two_fa_token: value.two_fa_token, is_pythagoras: isPythagoras, type, is_bank: isBank, } })
    changeStep(1)
  }


  const renderFirstStep = () => (
    <div>
      <p>Please enter your 2fa token:</p>
      <form onSubmit={onSubmit}>
        <div className="input-item input-with-label">
          <Input propertyName="two_fa_token" label="Token" state={value} setState={setValue} error={error} loading={loading} />
        </div>
        <Button color="primary" type="submit">Next</Button>
      </form>
    </div>
  )

  const renderSuccess = () => (
    <div>
      <a href={csvData} onClick={onClose} download={`${type.toLowerCase()}_kyc_list.csv`} className="btn btn-primary btn-block">Click to Download</a>
    </div>
  )


  return (
    <div>
      <Stepper activeStep={value.stepNumber}>
        <Step key={0}>
          <StepLabel>2FA token</StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel>Download</StepLabel>
        </Step>
      </Stepper>
      {value.stepNumber === 0 && renderFirstStep()}
      {value.stepNumber === 1 && renderSuccess()}
    </div>
  )
}

AdminExportKyc.propTypes = {
  type: propTypes.string.isRequired,
}


export default AdminExportKyc
