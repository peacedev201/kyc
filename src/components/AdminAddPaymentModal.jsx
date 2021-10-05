import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useMutation } from '@apollo/react-hooks'
import { SEND_GTO_PAYMENT } from '../queriesAndMutations'

import { toaster } from '../utils'

const useStyles = makeStyles(() => ({
  buttonSend: {
    marginTop: '10px',
  },
}))

const AdminAddPaymentModal = ({ dialogOpen, onCloseDialog, userId, transactionId }) => {
  const classes = useStyles()
  const [amountModal, setAmountModal] = useState(0)
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [sendGtoPaymentAction, { data: { sendGtoPayment = {} } = {} , error }] = useMutation(SEND_GTO_PAYMENT)

  const handleChangeInput = (event) => {
    setAmountModal(event.target.value)
  }

  const debounce = (f, ms) => {
    return function() {
      if (disabledBtn) {
        return;
      }

      f.apply(this, []);

      setDisabledBtn(true);

      setTimeout(() => setDisabledBtn(false), ms);
    };
  }

  useEffect(() => {
    if ((sendGtoPayment.data || {}).success === true) {
      toaster.success(sendGtoPayment.data.msg)
    }
  }, [setDisabledBtn, sendGtoPayment])

  useEffect(() => {
    if (error) {
      toaster.error(error.message)
    }
  },
  [setDisabledBtn, error])

  const sendAddPayment = () => {
    sendGtoPaymentAction({
      variables: {
        input: {
          userId: +userId,
          amount: +amountModal,
          transactionId: +transactionId
        },
      },
    })
  }

  return (
    <Dialog open={dialogOpen} onBackdropClick={onCloseDialog} onClose={onCloseDialog}>
      <DialogTitle>
        How much was transferred?
      </DialogTitle>
      <DialogContent>
        <TextField
          required
          type="number"
          fullWidth
          label="Amount"
          variant="outlined"
          onChange={handleChangeInput}
          value={amountModal}
        />
        <Button
          className={classes.buttonSend}
          onClick={() => {
            setDisabledBtn(true);
            debounce(sendAddPayment, 5000)()
          }}
          variant="contained"
          color="primary"
          disabled={disabledBtn}
        >
          Send
        </Button>
      </DialogContent>
    </Dialog>
  )
}

AdminAddPaymentModal.propTypes = {
  dialogOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func.isRequired,
}

export default AdminAddPaymentModal
