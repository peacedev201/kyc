import React, { useState } from 'react'
import propTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/react-hooks'
import qrcode from 'qrcode'
import Button from '@material-ui/core/Button'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Box from '@material-ui/core/Box'
import { NEW_2FA_SECRET, SET_2FA_SECRET } from '../../queriesAndMutations'
import { useMe } from '../../myHooks'
import Input from '../Input'
import { usePublicSettings } from '../../myHooks/useSettings'


const TwoFactorAuth = ({ onClose }) => {
  const [value, setValue] = useState({
    qrCodeUrl: null,
    stepNumber: 0,
    token: '',
  })

  const { data: { me: userData }, refetch: refetchMe } = useMe()
  const { data: { new2FASecret } = {} } = useQuery(NEW_2FA_SECRET)
  const [set2FASecret, { loading, error }] = useMutation(SET_2FA_SECRET)
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()


  const changeStep = (step) => setValue({
    ...value,
    stepNumber: step,
  })

  const secretToUrl = (secret) => `otpauth://totp/${encodeURIComponent((company || {}).name)}:${encodeURIComponent(userData.email)}?secret=${secret}`

  if (value.qrCodeUrl === null && new2FASecret) {
    qrcode.toDataURL(secretToUrl(new2FASecret)).then((qrCode) => setValue({
      ...value,
      qrCodeUrl: qrCode,
    }))
  }


  const onSubmitToken = async (e) => {
    e.preventDefault()
    await set2FASecret({ variables: { secret: new2FASecret, token: value.token } })
    changeStep(3)
    refetchMe()
  }


  const renderFirstStep = () => {
    const onNext = () => changeStep(1)

    return (
      <div>
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
          <p>
Please scan the QR Code below with any authenticator app on your phone that supports
          the standard QR Code security, eg: Google authenticator, Microsoft authenticator, Authy
          </p>
          <img src={value.qrCodeUrl} alt="" />
        </Box>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={onNext}>Next step</Button>

      </div>
    )
  }


  const renderSecondStep = () => {
    const onBack = () => changeStep(0)

    return (
      <div>
        <p>Please enter your 2fa code:</p>
        <form onSubmit={onSubmitToken}>
          <div className="input-item input-with-label">
            <Input propertyName="token" label="Token" state={value} setState={setValue} error={error} loading={loading} />
          </div>
          <Button onClick={onBack}>Previous step</Button>
          <Button color="primary" type="submit">Next step</Button>
        </form>
      </div>
    )
  }

  const renderSuccess = () => (
    <div>
      <p>Success! 2FA was successfully enabled!</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  )


  return (
    <div>
      <Stepper activeStep={value.stepNumber}>
        <Step key={0}>
          <StepLabel>Setting up 2fa</StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel>Confirm 2fa</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Success</StepLabel>
        </Step>
      </Stepper>
      {value.stepNumber === 0 && renderFirstStep()}
      {value.stepNumber === 1 && renderSecondStep()}
      {value.stepNumber === 3 && renderSuccess()}
    </div>
  )
}

TwoFactorAuth.propTypes = {
  onClose: propTypes.func.isRequired,
}


export default TwoFactorAuth
