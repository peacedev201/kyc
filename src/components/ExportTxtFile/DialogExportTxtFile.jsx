import React, {useState} from 'react'
import PropTypes from 'prop-types'
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { useMutation } from "@apollo/react-hooks";
import Input from "../Input";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

const DialogExportTxtFile = ({ nameDownloadFile, isDialogOpen, closeDialog, mutation }) => {
  const [value, setValue] = useState({
    stepNumber: 0,
    twoFaToken: '',
    month: "01",
  })

  const [txtFileContractedAction, { loading, error, data }] = useMutation(mutation)
  let mutationBody = '';
  if (data) {
    mutationBody = data[(Object.keys(data))[0]]
  }

  const changeStep = (step) => setValue({
    ...value,
    stepNumber: step,
  })

  const txtData = mutationBody !== '' && URL.createObjectURL(new Blob([mutationBody], {type: 'text/txt'}))

  const onSubmitTwoFAToken = (e) => {
    e.preventDefault();
    changeStep(1);
  }

  const onSubmitMonth = async (e) => {
    e.preventDefault();
    await txtFileContractedAction({
      variables: { twoFaToken: value.twoFaToken, month: value.month },
    });
    changeStep(2);
  }

  const renderFirstStep = () => (
    <div>
      <p>Please enter your 2fa token:</p>
      <form onSubmit={onSubmitTwoFAToken}>
        <div className="input-item input-with-label">
          <Input
            propertyName="twoFaToken"
            label="Token"
            state={value}
            setState={setValue}
            error={error}
            loading={loading}
          />
        </div>
        <Button color="primary" type="submit">
          Next
        </Button>
      </form>
    </div>
  );

  const renderSelectMonthStep = () => (
    <div>
      <p>Please select month for export</p>
      <form onSubmit={onSubmitMonth}>
        <div className="input-item input-with-label">
          <Input
            propertyName="month"
            label="Select month"
            state={value}
            setState={setValue}
            error={error}
            loading={loading}
            select
          >
            {['01','02','03','04','05','06','07','08','09','10','11','12'].map((month) => (
              <MenuItem key={`month_${month}`} value={month}>
                {month}
              </MenuItem>
            ))}
          </Input>
        </div>
        <Button color="primary" type="submit">
          Next
        </Button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div>
      <a href={txtData} onClick={closeDialog} download={`${nameDownloadFile.toLowerCase()}.txt`} className="btn btn-primary btn-block">Click to Download</a>
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog}>
      <DialogContent>
        <div>
          <Stepper activeStep={value.stepNumber}>
            <Step key={0}>
              <StepLabel>2FA token</StepLabel>
            </Step>
            <Step key={1}>
              <StepLabel>Select Month</StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>Download</StepLabel>
            </Step>
          </Stepper>
          {value.stepNumber === 0 && renderFirstStep()}
          {value.stepNumber === 1 && renderSelectMonthStep()}
          {value.stepNumber === 2 && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

DialogExportTxtFile.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  nameDownloadFile: PropTypes.string.isRequired,
}

export default DialogExportTxtFile
