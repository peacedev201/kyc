import React, { useState } from 'react'
import propTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { DISABLE_2FA } from '../../queriesAndMutations'
import { useMe } from '../../myHooks'
import Input from '../Input'


const DisableTwoFactorAuth = ({ onClose }) => {
  const [value, setValue] = useState({
    stepNumber: 0,
    token: '',
  })

  const { refetch: refetchMe } = useMe()
  const [disable2FA, { loading, error }] = useMutation(DISABLE_2FA)


  const changeStep = (step) => setValue({
    ...value,
    stepNumber: step,
  })


  const onSubmitToken = async (e) => {
    e.preventDefault()
    await disable2FA({ variables: { token: value.token } })
    changeStep(2)
    refetchMe()
  }


  const renderFirstStep = () => (
    <div>
      <p>To confirm disabling 2fa, please, enter 2fa token:</p>
      <form onSubmit={onSubmitToken}>
        <div className="input-item input-with-label">
          <Input propertyName="token" label="Token" state={value} setState={setValue} error={error} loading={loading} />
        </div>
        <Button onClick={onClose}>Close</Button>
        <Button color="primary" type="submit">Confirm</Button>
      </form>
    </div>
  )

  const renderSuccess = () => (
    <div>
      <p>Success! 2FA was successfully disabled!</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  )


  return (
    <div>
      <Stepper activeStep={value.stepNumber}>
        <Step key={1}>
          <StepLabel>Confirmation</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Success</StepLabel>
        </Step>
      </Stepper>
      {value.stepNumber === 0 && renderFirstStep()}
      {value.stepNumber === 2 && renderSuccess()}
    </div>
  )
}

DisableTwoFactorAuth.propTypes = {
  onClose: propTypes.func.isRequired,
}


export default DisableTwoFactorAuth
