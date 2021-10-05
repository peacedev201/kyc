import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "../../styles/legacy/style.scss";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { DialogTitle } from "@material-ui/core";
import { toaster } from "../../utils";
import Grid from "@material-ui/core/Grid";
import Input from "../Input";
import { useMe } from "../../myHooks";
import { useMutation } from "@apollo/react-hooks";
import MenuItem from "@material-ui/core/MenuItem";
import {
  WALLET_ENGINE_TOPUP_CHANNELS,
  WALLET_ENGINE_TOPUP_BANK,
  WALLET_ENGINE_TOPUP_RAPYD_CHECKOUT,
} from "../../queriesAndMutations/walletEngineMutation";

const useStyles = makeStyles(() => ({
  dialog: {
    "& .MuiDialog-paper": {
      padding: "10px 0 26px 0",
    },
  },
}));

const TopUpAmountDialog = ({
  dialogOpen,
  onCloseDialog,
  onTopUpSuccess,
}) => {
  const classes = useStyles();
  const { data: { me: userData }, refetch } = useMe();
  const [values, setValues] = useState({
    wallet_engine_topup_amount: "",
    wallet_engine_channel: "",
    wallet_engine_selected_channel: null,
    wallet_engine_available_channels: null,
    is_submit_topup_success: false,
    wallet_engine_request_id: "",
    wallet_engine_browser_url: "",
    ...userData,
  });
  const bankTransferDetails =
    values.wallet_engine_selected_channel &&
    values.wallet_engine_selected_channel.method === "topup/bank" ? values.wallet_engine_selected_channel.variables : {};
  const [walletEngineChannels] = useMutation(WALLET_ENGINE_TOPUP_CHANNELS);
  const [walletEngineTopUpBank] = useMutation(WALLET_ENGINE_TOPUP_BANK);
  const [walletEngineTopUpRapidCheckout] = useMutation(WALLET_ENGINE_TOPUP_RAPYD_CHECKOUT);
  const walletEngineAppID = "5db2a50be7664";

  const submitFormTopUp = async (e) => {
    e.preventDefault();
    const selected_channel = values.wallet_engine_available_channels.find(
      (value) => value.channel === values.wallet_engine_channel
    );
    const topUpAmount = values.wallet_engine_topup_amount;
    if(!selected_channel){
      return;
    }
    const bodyData = {
      app_id: walletEngineAppID,
      amount: parseInt(topUpAmount),
      channel_id: selected_channel.channel
    }

    if (selected_channel.method === 'topup/bank') {
      await walletEngineTopUpBank({
        variables: { input: bodyData },
      }).then((response) => {
        console.log(response);
        if (response.data.walletEngineTopupBank.status === "success") {
          toaster.success(response.data.walletEngineTopupBank.message);
          setValues({
            ...values,
            is_submit_topup_success: true,
            wallet_engine_selected_channel: selected_channel,
            wallet_engine_request_id: response.data.walletEngineTopupBank.request_id,
          });
          onTopUpSuccess(true);
        } else {
          toaster.error(response.data.walletEngineTopupBank.message);
        }
        // onCloseDialog();
      });
    } else {
      if (selected_channel.method === 'topup/rapyd/checkout') {
        await walletEngineTopUpRapidCheckout({
          variables: { input: bodyData },
        }).then((response) => {
          console.log(response);
          if (response.data.walletEngineTopupRapydCheckout.status === "success") {
            toaster.success(response.data.walletEngineTopupRapydCheckout.message);
            setValues({
              ...values,
              is_submit_topup_success: true,
              wallet_engine_selected_channel: selected_channel,
              wallet_engine_request_id:
                response.data.walletEngineTopupRapydCheckout.request_id,
              wallet_engine_browser_url:
                response.data.walletEngineTopupRapydCheckout.browser_url,
            });
            onTopUpSuccess(true);
          } else {
            toaster.error(response.data.walletEngineTopupRapydCheckout.message);
          }
          // onCloseDialog();
        });
      }
    }
    await refetch();
  };

  const getChannels = async (e) => {
    const bodyData = {
      app_id: walletEngineAppID
    }
    await walletEngineChannels({
      variables: { input: bodyData }
    }).then((response) => {
      console.log(response)
      if (response.data.walletEngineTopupChannels.status === 'success') {
        const channels = response.data.walletEngineTopupChannels.channels;
        setValues({ ...values, wallet_engine_available_channels: channels });
      }
    })
  }

  useEffect(() => {
    if (dialogOpen) {
      getChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const menuItems = [];

  if (values.wallet_engine_available_channels) {
    values.wallet_engine_available_channels.forEach((value, index) => {
      if (value.status === "active"){
        menuItems.push(
          <MenuItem key={value.channel} value={value.channel}>
            {value.title}
          </MenuItem>
        );
      };
    });
  };

  const formTopUp = () => (
    <form onSubmit={submitFormTopUp}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <div className="input-with-label input-wallet-item">
            <Input
              propertyName="wallet_engine_topup_amount"
              label="Amount EUR"
              state={values}
              setState={setValues}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Input
            propertyName="wallet_engine_channel"
            label="Select Wallet Channels"
            state={values}
            setState={setValues}
            select
          >
            {menuItems}
          </Input>
        </Grid>
      </Grid>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )

  const bankTranserInformation = () => (
    <div>
      <p>Please effect a bank transfer to account with details:</p>
      <p>
        - Account name: <strong>{bankTransferDetails.account_name}</strong>
      </p>
      <p>
        - Account number: <strong>{bankTransferDetails.account_number}</strong>
      </p>
      <p>
        - Bank name: <strong>{bankTransferDetails.bank_name}</strong>
      </p>
      <p>
        - Bank code: <strong>{bankTransferDetails.bank_code}</strong>
      </p>
      <p>
        - Bank branch code:{" "}
        <strong>{bankTransferDetails.bank_branch_code}</strong>
      </p>
      <p>
        - IBAN code: <strong>{bankTransferDetails.iban_code}</strong>
      </p>
      <p>
        - SWIFT code: <strong>{bankTransferDetails.swift_code}</strong>
      </p>
      <p>Please not the message text in your transfer:</p>
      <p>
        - Message: <strong>{values.wallet_engine_request_id}</strong>
      </p>
      <h6>After Wallet received your balance, your wallet account will automatically
      get a deposit.</h6>
    </div>
  );

  const bankRapidCheckout = () => (
    <div>
      <p>Open the link below on new tab and followup to complete top up:</p>
      <a
        href={values.wallet_engine_browser_url}
        target="_blank"
        className="btn btn-info"
        rel="noopener noreferrer"
      >
        PAYMENT LINK
      </a>
    </div>
  );

  const renderTopUpDialog = () => (
    <Dialog
      className={classes.dialog}
      open={dialogOpen}
      onClose={onCloseDialog}
    >
      <DialogTitle>Add amount for TopUp to Wallet</DialogTitle>
      <DialogContent>
        {values.is_submit_topup_success
          ? values.wallet_engine_selected_channel
            ? (values.wallet_engine_selected_channel.method === "topup/bank")
              ? bankTranserInformation()
              : bankRapidCheckout()
            : formTopUp()
          : formTopUp()}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {renderTopUpDialog()}
    </>
  );
};

TopUpAmountDialog.propTypes = {
  dialogOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func.isRequired,
};

export default TopUpAmountDialog;
